// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.post('/send', auth, chatController.sendMessage);
router.get('/:userId', auth, chatController.getMessagesWithUser);
router.get('/unread/:userId', auth, chatController.getUnreadMessages);
router.patch('/mark-read', auth, chatController.markMessagesAsRead);

module.exports = router;
