const Lead = require('../models/Lead');
const Property = require('../models/Property');

/**
 * POST /api/leads
 * Public — user submits an inquiry / books a visit
 */
const createLead = async (req, res, next) => {
  try {
    const { userName, userPhone, userEmail, property_id, message, source } = req.body;

    if (!userName || !userPhone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    // Snapshot property title so lead survives property deletion
    let propertyTitle = '';
    if (property_id) {
      const prop = await Property.findById(property_id).select('title');
      if (prop) propertyTitle = prop.title;
    }

    const lead = await Lead.create({
      userName,
      userPhone,
      userEmail,
      property_id,
      propertyTitle,
      message,
      source: source || 'contact_form',
    });

    res.status(201).json({ success: true, message: 'Inquiry sent! Our agent will contact you shortly.', lead });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leads
 * Admin — get all leads with optional status filter
 */
const getLeads = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const leads = await Lead.find(filter)
      .populate('property_id', 'title location type price')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/leads/:id
 * Admin — update lead status or add notes
 */
const updateLead = async (req, res, next) => {
  try {
    const { status, notes, visitDate } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (visitDate) update.visitDate = visitDate;

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/leads/:id
 * Admin — delete a lead
 */
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createLead, getLeads, updateLead, deleteLead };
