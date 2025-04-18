const { Router } = require('express');
const router = Router();
const {
  getAllMessages,
  getConversationWithFriend,
  getMessageById,
  sendMessageToFriend,
} = require('../controller/messageController');

router.get('/', getAllMessages);
router.get('/:userId/conversations/:friendId', getConversationWithFriend);
router.get('/:userId/message/:messageId', getMessageById);

router.post('/:userId/conversations/:friendId', sendMessageToFriend);
// router.patch('/:userId/messages/:messageId', updateMessageToFriend);
// router.delete('/:userId/messages/:messageId', deleteMessageToFriend);

module.exports = router;
