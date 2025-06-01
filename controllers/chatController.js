// controllers/chatController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content
  });

  res.status(201).json(message);
};

exports.getMessagesWithUser = async (req, res) => {
  const userId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id }
    ]
  }).sort({ timestamp: 1 });

  res.json(messages);
};

exports.getUnreadMessages = async (req, res) => {
  const fromUserId = req.params.userId;

  const messages = await Message.find({
    sender: fromUserId,
    receiver: req.user._id,
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
