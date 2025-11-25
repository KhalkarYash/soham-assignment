const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  createPost,
  getFeed,
  getPost,
  likePost,
  addComment,
  deletePost,
  editPost,
  getUserPosts
} = require('../controllers/postController');

const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/feed', authMiddleware, getFeed);
router.get('/:postId', getPost);
router.post('/:postId/like', authMiddleware, likePost);
router.post('/:postId/comment', authMiddleware, addComment);
router.delete('/:postId', authMiddleware, deletePost);
router.put('/:postId', authMiddleware, editPost);
router.get('/user/:userId', getUserPosts);

module.exports = router;
