const express = require('express');
const { getUsers, toggleUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All user routes are admin-only
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/toggle', protect, authorize('admin'), toggleUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
