const { Router } = require('express');
const router = Router();

router.get('/', getAllMessages);
router.get('/:userId/conversations/:friendId', getMessagesByFriend);
router.get('/:userId/messages/:messageId', getMessageById);

router.post('/:userId/conversations/:friendId', sendMessageToFriend);
router.patch('/:userId/messages/:messageId', updateMessageToFriend);
router.delete('/:userId/messages/:messageId', deleteMessageToFriend);

module.exports = router;
