const { Router } = require('express');
const router = Router();
const {
  getAllMessages,
  getConversationWithUser,
  getMessageById,
  sendMessage,
  updateUserMessage,
  deleteUserMessage,
} = require('../controller/messageController');

router.get('/', getAllMessages);
router.get('/:userId/conversations/:friendId', getConversationWithUser);
router.get('/:userId/message/:messageId', getMessageById);

router.post('/:userId/conversations/:friendId', sendMessage);
router.patch('/:userId/message/:messageId', updateUserMessage);
router.delete('/:userId/message/:messageId', deleteUserMessage);

module.exports = router;
