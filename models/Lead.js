const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    userPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    userEmail: { type: String, trim: true, lowercase: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    propertyTitle: { type: String }, // Snapshot in case property is deleted
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    // Lead lifecycle
    status: {
      type: String,
      enum: ['new', 'contacted', 'visit_scheduled', 'closed', 'cancelled'],
      default: 'new',
    },
    source: {
      type: String,
      enum: ['contact_form', 'whatsapp', 'book_visit', 'get_details'],
      default: 'contact_form',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    visitDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
