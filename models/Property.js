const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    type: {
      type: String,
      enum: ['PG', 'Flat'],
      required: [true, 'Property type is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    area: { type: String, trim: true },
    city: { type: String, default: 'Delhi', trim: true },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    priceType: {
      type: String,
      enum: ['month', 'day'],
      default: 'month',
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    amenities: [
      {
        type: String,
        enum: [
          'WiFi', 'AC', 'Geyser', 'Laundry', 'Parking', 'Security',
          'CCTV', 'Gym', 'Meals', 'Food', 'Power Backup', 'TV', 'Fridge',
          'Furnished', 'Water Supply', 'Attached Bathroom',
        ],
      },
    ],
    images: [{ type: String }], // URL strings (Cloudinary or external)
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    occupancy: {
      type: [String],
      enum: ['Single', 'Double', 'Triple', 'Dormitory', '1BHK', '2BHK', '3BHK', '4BHK+', 'Studio'],
      default: [],
    },
    // Owner info — NEVER exposed to public users
    ownerName: { type: String, trim: true },
    ownerPhone: { type: String, trim: true },
    ownerEmail: { type: String, trim: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Listing lifecycle
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    featured: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

// Full-text search index
propertySchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Property', propertySchema);
