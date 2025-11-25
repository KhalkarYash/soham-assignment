const User = require('../models/User');
const Notification = require('../models/Notification');

const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyExists = targetUser.friendRequests.some(req => req.from.equals(req.userId));
    if (alreadyExists) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    targetUser.friendRequests.push({ from: req.userId });
    await targetUser.save();

    await Notification.create({
      user: userId,
      from: req.userId,
      type: 'friendRequest'
    });

    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requestIndex = currentUser.friendRequests.findIndex(req => req.from.equals(userId));
    if (requestIndex === -1) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }

    currentUser.friendRequests.splice(requestIndex, 1);
    currentUser.friends.push(userId);
    targetUser.friends.push(req.userId);

    await currentUser.save();
    await targetUser.save();

    await Notification.create({
      user: userId,
      from: req.userId,
      type: 'friendAccepted'
    });

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.userId);
    const requestIndex = currentUser.friendRequests.findIndex(req => req.from.equals(userId));

    if (requestIndex === -1) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }

    currentUser.friendRequests.splice(requestIndex, 1);
    await currentUser.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(userId);

    currentUser.friends = currentUser.friends.filter(id => !id.equals(userId));
    targetUser.friends = targetUser.friends.filter(id => !id.equals(req.userId));

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('friends', 'username profilePic email bio');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('friendRequests.from', 'username profilePic email');

    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests
};
