const { Router } = require('express');
const router = Router();
const {
  getAllNotificationsForUser,
  getUnreadNotificationsForUser,
  createNotification,
  readNotification,
  readAllNotificationsForUser,
  //   deleteNotification,
  //   deleteAllNotifications,
} = require('../controller/notificationController');

router.get('/:recipientId', getAllNotificationsForUser);
router.get('/:recipientId/unread', getUnreadNotificationsForUser);

router.post('/:recipientId', createNotification);

router.patch('/:notificationId/read', readNotification);
router.patch('/:recipientId/read-all', readAllNotificationsForUser);

// router.delete('/:notificationId', deleteNotification);
// router.delete('.reciprientId', deleteAllNotifications);

module.exports = router;
