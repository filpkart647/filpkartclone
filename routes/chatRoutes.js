// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require("../middleware/auth")

router.post('/send', authMiddleware.auth, chatController.sendMessage);
router.get('/:userId', authMiddleware.auth, chatController.getMessagesWithUser);
router.get('/unread/:userId', authMiddleware.auth, chatController.getUnreadMessages);
router.patch('/mark-read', authMiddleware.auth, chatController.markMessagesAsRead);

module.exports = router;
