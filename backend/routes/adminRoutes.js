const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  getDashboard,
  getAllUsers,
  deleteUser,
  banUser,
  unbanUser,
  getAllPosts,
  deletePostAdmin,
  getAllReports,
  updateReportStatus,
  createReport
} = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboard);
router.get('/users', authMiddleware, getAllUsers);
router.delete('/users/:userId', authMiddleware, deleteUser);
router.post('/users/:userId/ban', authMiddleware, banUser);
router.post('/users/:userId/unban', authMiddleware, unbanUser);
router.get('/posts', authMiddleware, getAllPosts);
router.delete('/posts/:postId', authMiddleware, deletePostAdmin);
router.get('/reports', authMiddleware, getAllReports);
router.put('/reports/:reportId', authMiddleware, updateReportStatus);
router.post('/report', authMiddleware, createReport);

module.exports = router;
