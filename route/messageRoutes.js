const { Router } = require('express');
const router = Router();
const {
  getAllMessages,
  getAllConversations,
  getConversationWithUser,
  getMessageById,
  sendMessage,
  updateUserMessage,
  deleteUserMessage,
  deleteConversationWithUser,
} = require('../controller/messageController');

const auth = require('../middleware/authMiddleware');

router.get('/', auth, getAllMessages);
router.get('/:userId/conversation', auth, getAllConversations);
router.get('/:userId/conversation/:friendId', auth, getConversationWithUser);
router.get('/:userId/message/:messageId', auth, getMessageById);

router.post('/:userId/conversation/:friendId', auth, sendMessage);
router.patch('/:userId/message/:messageId', auth, updateUserMessage);
router.delete('/:userId/message/:messageId', auth, deleteUserMessage);
router.delete(
  '/:userId/conversation/:friendId',
  auth,
  deleteConversationWithUser
);

module.exports = router;
