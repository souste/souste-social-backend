const { Router } = require('express');
const router = Router();
const {
  getAllFriendships,
  getFriendStatus,
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  unfriend,
  getFriends,
  getPendingRequests,
  getFriendSuggestions,
} = require('../controller/friendRequestController');

const auth = require('../middleware/authMiddleware');

router.get('/', auth, getAllFriendships);
router.get('/:userId/status/:friendId', auth, getFriendStatus);

router.post('/:userId/send/:friendId', auth, sendRequest);

router.patch('/:userId/accept/:friendId', auth, acceptRequest);
router.patch('/:userId/reject/:friendId', auth, rejectRequest);

router.delete('/:userId/cancel/:friendId', auth, cancelRequest);
router.delete('/:userId/unfriend/:friendId', auth, unfriend);

router.get('/:id/friends', auth, getFriends);
router.get('/:id/pending', auth, getPendingRequests);
router.get('/:id/suggestions', auth, getFriendSuggestions);

module.exports = router;
