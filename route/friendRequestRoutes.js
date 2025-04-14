const { Router } = require('express');
const router = Router();
const {
  getAllFriendships,
  getFriendStatus,
  sendRequest,
  acceptRequest,
  rejectRequest,
  unfriend,
  getFriends,
} = require('../controller/friendRequestController');

router.get('/', getAllFriendships);
router.get('/:userId/status/:friendId', getFriendStatus);

router.post('/:userId/send/:friendId', sendRequest);

router.patch('/:userId/accept/:friendId', acceptRequest);
router.patch('/:userId/reject/:friendId', rejectRequest);

router.delete('/:userId/unfriend/:friendId', unfriend);

router.get('/:id/friends', getFriends);
// router.get('/:id/pending', getPendingFriends);

module.exports = router;
