const express = require('express');
const { register, login, getProfile, getUser, updateProfile, searchUsers } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.get('/user/:userId', getUser);
router.put('/profile', authMiddleware, updateProfile);
router.get('/search', searchUsers);

module.exports = router;
