// controllers/chatController.js
const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (req.user.userId == receiverId) {
    const user =  await User.findOne({ username:'admin' });
    receiverId = user.id
  }

  const message = await Message.create({
    sender: req.user.userId,
    receiver: receiverId,
    content
  });

  res.status(201).json(message);
};

exports.getMessagesWithUser = async (req, res) => {
  const userId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { sender: req.user.userId, receiver: userId },
      { sender: userId, receiver: req.user.userId }
    ]
  }).sort({ timestamp: 1 });

  res.json(messages);
};

exports.getUnreadMessages = async (req, res) => {
  const fromUserId = req.params.userId;

  const messages = await Message.find({
    sender: fromUserId,
    receiver: req.user.userId,
    isRead: false
  });

  res.json(messages);
};

exports.markMessagesAsRead = async (req, res) => {
  const { messageIds } = req.body;

  await Message.updateMany(
    { _id: { $in: messageIds } },
    { $set: { isRead: true } }
  );

  res.json({ success: true });
};
