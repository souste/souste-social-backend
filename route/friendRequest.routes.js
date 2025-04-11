const { Router } = require('express');
const router = Router();

router.post('/:id/send', sendRequest);
// router.post('/:id/accept', acceptRequest);
// router.post('/:id/reject', rejectRequest);

// router.post('/:id/unfriend', unfriend);

// router.get('/:id/friends', getFriends);
// router.get('/:id/pending', getPendingFriends);

module.exports = router;
