const express = require('express');
const { body } = require('express-validator');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  toggleFeatured,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const propertyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('type').isIn(['PG', 'Flat', 'Room', 'Hostel']).withMessage('Type must be PG, Flat, Room, or Hostel'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
];

// Public routes (admin can also pass token to see all statuses)
router.get('/', (req, res, next) => {
  // Optionally attach user if token present (allows admin view)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      User.findById(decoded.id)
        .then((user) => {
          req.user = user;
          next();
        })
        .catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
}, getProperties);

router.get('/:id', getProperty);

// Public — anyone can submit a property for review (owner submissions)
router.post('/', propertyValidation, createProperty);

// Admin only
router.put('/:id', protect, authorize('admin'), updateProperty);
router.delete('/:id', protect, authorize('admin'), deleteProperty);
router.put('/:id/approve', protect, authorize('admin'), approveProperty);
router.put('/:id/feature', protect, authorize('admin'), toggleFeatured);

module.exports = router;
