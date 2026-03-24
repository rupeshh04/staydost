const { validationResult } = require('express-validator');
const Property = require('../models/Property');

/**
 * GET /api/properties
 * Public — get all approved properties with filters
 */
const getProperties = async (req, res, next) => {
  try {
    const { type, location, minPrice, maxPrice, amenities, gender, featured, search } = req.query;

    // Base filter: only approved listings visible to public
    const filter = { status: 'approved', available: true };

    if (type && ['PG', 'Flat'].includes(type)) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (gender && ['Male', 'Female', 'Any'].includes(gender)) filter.gender = gender;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (amenities) {
      const list = amenities.split(',').map((a) => a.trim());
      filter.amenities = { $all: list };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Admin can see all statuses
    if (req.user && req.user.role === 'admin') {
      delete filter.status;
      delete filter.available;
      if (req.query.status) filter.status = req.query.status;
    }

    const properties = await Property.find(filter)
      .select('-ownerPhone -ownerEmail -adminNotes') // Never expose owner contact to public
      .sort({ featured: -1, createdAt: -1 });

    res.json({ success: true, count: properties.length, properties });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/properties/:id
 * Public — get a single property (increments view count)
 */
const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).select('-ownerPhone -ownerEmail -adminNotes');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Only show pending/rejected to admin
    if (property.status !== 'approved') {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }
    }

    // Increment view count (fire-and-forget)
    Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json({ success: true, property });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/properties
 * Private — admin adds property, owner submits for review
 */
const createProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const data = { ...req.body };
    if (req.user) data.owner_id = req.user._id;

    // Admin-created properties are auto-approved; all others go to pending
    data.status = (req.user && req.user.role === 'admin') ? 'approved' : 'pending';

    const property = await Property.create(data);
    res.status(201).json({ success: true, property });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/properties/:id
 * Admin — update any field of a property
 */
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, property });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/properties/:id
 * Admin — permanently delete a property
 */
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/properties/:id/approve
 * Admin — approve or reject a pending submission
 */
const approveProperty = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved, rejected, or pending' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, property });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/properties/:id/feature
 * Admin — toggle featured flag
 */
const toggleFeatured = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.featured = !property.featured;
    await property.save();

    res.json({ success: true, featured: property.featured });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProperties, getProperty, createProperty, updateProperty, deleteProperty, approveProperty, toggleFeatured };
