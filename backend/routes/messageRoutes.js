const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  sendMessage,
  getConversation,
  getConversations
} = require('../controllers/messageController');

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/conversation/:userId', authMiddleware, getConversation);
router.get('/', authMiddleware, getConversations);

module.exports = router;
