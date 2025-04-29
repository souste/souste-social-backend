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

router.get('/:recipientId', getAllNotificationsForUser);
router.get('/:recipientId/unread', getUnreadNotificationsForUser);

router.post('/:recipientId', createNotification);

router.patch('/:notificationId/read', readNotification);
router.patch('/:recipientId/read-all', readAllNotificationsForUser);

router.delete('/:notificationId', deleteNotification);
router.delete('/user/:recipientId', deleteAllNotificationsForUser);

module.exports = router;
