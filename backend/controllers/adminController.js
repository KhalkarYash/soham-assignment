const User = require('../models/User');
const Post = require('../models/Post');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalReports = await Report.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });

    const dailyPosts = await Post.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    res.json({
      totalUsers,
      totalPosts,
      totalReports,
      bannedUsers,
      dailyPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);
    await Post.deleteMany({ author: userId });
    await Notification.deleteMany({ user: userId });

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: false },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePostAdmin = async (req, res) => {
  try {
    const { postId } = req.params;

    await Post.findByIdAndDelete(postId);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'username')
      .populate('reportedUser', 'username')
      .populate('reportedPost')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, action } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status, action },
      { new: true }
    ).populate('reportedBy', 'username')
     .populate('reportedUser', 'username');

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReport = async (req, res) => {
  try {
    const { reportedUserId, reportedPostId, reason, description } = req.body;

    const report = new Report({
      reportedBy: req.userId,
      reportedUser: reportedUserId,
      reportedPost: reportedPostId,
      reason,
      description
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
