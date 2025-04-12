const { Router } = require('express');
const router = Router();
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
} = require('../controller/friendRequestController');

router.post('/:userId/send/:friendId', sendRequest);

router.patch('/:userId/accept/:friendId', acceptRequest);
router.patch('/:userId/reject/:friendId', rejectRequest);

// router.delete('/:id/unfriend', unfriend);

// router.get('/:id/friends', getFriends);
// router.get('/:id/pending', getPendingFriends);

module.exports = router;
