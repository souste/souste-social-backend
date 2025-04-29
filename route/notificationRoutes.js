const { Router } = require('express');
const router = Router();
const {
  //   getAllNotificationsForUser,
  //   getUnreadNotifications,
  createNotification,
  //   readNotification,
  //   readAllNotifications,
  //   deleteNotification,
  //   deleteAllNotifications,
} = require('../controller/notificationController');

// router.get('/:recipientId', getAllNotificationsForUser);
// router.get('/:recipientId', getUnreadNotifications);

router.post('/:recipientId', createNotification);

// router.patch('/:notificationId/read', readNotification);
// router.patch('./notifications/read-all', readAllNotifications);

// router.delete('/:notificationId', deleteNotification);
// router.delete('.reciprientId', deleteAllNotifications);

module.exports = router;
