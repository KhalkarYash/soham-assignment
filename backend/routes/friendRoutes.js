const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests
} = require('../controllers/friendController');

const router = express.Router();

router.post('/:userId/request', authMiddleware, sendFriendRequest);
router.post('/:userId/accept', authMiddleware, acceptFriendRequest);
router.post('/:userId/reject', authMiddleware, rejectFriendRequest);
router.delete('/:userId', authMiddleware, removeFriend);
router.get('/:userId', getFriends);
router.get('/pending/requests', authMiddleware, getPendingRequests);

module.exports = router;
