const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/:notificationId/read', authMiddleware, markAsRead);
router.put('/read/all', authMiddleware, markAllAsRead);

module.exports = router;
