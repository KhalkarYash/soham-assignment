const Message = require('../models/Message');
const Notification = require('../models/Notification');

const sendMessage = async (req, res) => {
  try {
    const { recipients, content, image } = req.body;

    const message = new Message({
      sender: req.userId,
      recipients,
      content,
      image
    });

    await message.save();
    await message.populate('sender', 'username profilePic');

    recipients.forEach(async (recipientId) => {
      if (recipientId !== req.userId.toString()) {
        await Notification.create({
          user: recipientId,
          from: req.userId,
          type: 'message'
        });
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipients: userId },
        { sender: userId, recipients: req.userId }
      ]
    })
      .populate('sender', 'username profilePic')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId },
        { recipients: req.userId }
      ]
    })
      .populate('sender', 'username profilePic')
      .populate('recipients', 'username profilePic')
      .sort({ createdAt: -1 });

    const conversations = [];
    const seen = new Set();

    messages.forEach(msg => {
      const otherId = msg.sender._id.equals(req.userId) 
        ? msg.recipients[0]._id 
        : msg.sender._id;
      
      if (!seen.has(otherId.toString())) {
        seen.add(otherId.toString());
        conversations.push(msg);
      }
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations
};
