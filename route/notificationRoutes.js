const { Router } = require('express');
const router = Router();
const {
  getAllNotificationsForUser,
  getUnreadNotificationsForUser,
  createNotification,
  readNotification,
  readAllNotificationsForUser,
  deleteNotification,
  deleteAllNotificationsForUser,
} = require('../controller/notificationController');

const auth = require('../middleware/authMiddleware');

router.get('/:recipientId', getAllNotificationsForUser);
router.get('/:recipientId/unread', auth, getUnreadNotificationsForUser);

router.post('/:recipientId', auth, createNotification);

router.patch('/:notificationId/read', auth, readNotification);
router.patch('/:recipientId/read-all', auth, readAllNotificationsForUser);

router.delete('/:notificationId', auth, deleteNotification);
router.delete('/user/:recipientId', auth, deleteAllNotificationsForUser);

module.exports = router;
