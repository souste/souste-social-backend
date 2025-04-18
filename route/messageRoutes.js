const { Router } = require('express');
const router = Router();
const {
  getAllMessages,
  //   getAllConversations,
  getConversationWithUser,
  getMessageById,
  sendMessage,
  updateUserMessage,
  deleteUserMessage,
} = require('../controller/messageController');

router.get('/', getAllMessages);
// router.get('/:userId/conversation', getAllConversations);
router.get('/:userId/conversation/:friendId', getConversationWithUser);
router.get('/:userId/message/:messageId', getMessageById);

router.post('/:userId/conversation/:friendId', sendMessage);
router.patch('/:userId/message/:messageId', updateUserMessage);
router.delete('/:userId/message/:messageId', deleteUserMessage);

module.exports = router;
