const { Router } = require('express');
const router = Router();
const { sendRequest } = require('../controller/friendRequestController');

router.post('/:id/send', sendRequest);

// router.patch('/:userId/accept/:friendId', acceptRequest);
// router.patch('/:id/reject', rejectRequest);

// router.delete('/:id/unfriend', unfriend);

// router.get('/:id/friends', getFriends);
// router.get('/:id/pending', getPendingFriends);

module.exports = router;
