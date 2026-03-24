const express = require('express');
const { createLead, getLeads, updateLead, deleteLead } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public — anyone can submit an inquiry
router.post('/', createLead);

// Admin only
router.get('/', protect, authorize('admin'), getLeads);
router.put('/:id', protect, authorize('admin'), updateLead);
router.delete('/:id', protect, authorize('admin'), deleteLead);

module.exports = router;
