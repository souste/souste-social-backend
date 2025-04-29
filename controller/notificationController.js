const pool = require('../db/pool');

const getAllNotificationsForUser = async (req, res, next) => {
  try {
    const recipientId = parseInt(req.params.recipientId);

    const recipientCheck = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [recipientId]
    );
    if (recipientCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipient Not Found',
        message: `No recipient found with id ${recipientId}`,
      });
    }

    const result = await pool.query(
      `SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC`,
      [recipientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No notifications found',
        message: `No notifications found for recipient ${recipientId}`,
      });
    }

    res.status(200).json({
      success: true,
      notifications: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const getUnreadNotificationsForUser = async (req, res, next) => {
  try {
    const recipientId = parseInt(req.params.recipientId);

    const recipientCheck = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [recipientId]
    );
    if (recipientCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipient Not Found',
        message: `No recipient found with id ${recipientId}`,
      });
    }

    const result = await pool.query(
      `
            SELECT * FROM notifications 
            WHERE recipient_id = $1 AND is_read = false 
            ORDER BY created_at DESC `,
      [recipientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No notifications found',
        message: `No notifications found for recipient ${recipientId}`,
      });
    }

    res.status(200).json({
      success: true,
      notifications: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const recipientId = parseInt(req.params.recipientId);
    const senderId = req.user.id;
    const { type, referenceId, message } = req.body;

    const validTypes = [
      'post',
      'comment',
      'message',
      'friend_request',
      'friend_accept',
      'like_post',
      'like_comment',
    ];

    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameters',
        message: `Notification type is required and must be one of ${validTypes.join(', ')}`,
      });
    }

    const recipientCheck = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [recipientId]
    );
    if (recipientCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipient Not Found',
        message: `No recipient found with id ${recipientId}`,
      });
    }

    const senderCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      senderId,
    ]);
    if (senderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sender Not Found',
        message: `No Sender found with id ${senderId}`,
      });
    }

    if (!recipientId || !referenceId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing fields',
        message: 'recipientId, referenceId and message are required',
      });
    }

    if (recipientId === senderId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Action',
        message: 'Users cannot sent notifications to themselves',
      });
    }

    const result = await pool.query(
      `INSERT INTO notifications(type, reference_id, message, recipient_id, sender_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [type, referenceId, message, recipientId, senderId]
    );

    return res.status(201).json({
      success: true,
      notification: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const readNotification = async (req, res, next) => {
  try {
    const notificationId = parseInt(req.params.notificationId);

    const existingNotification = await pool.query(
      `SELECT * FROM notifications WHERE id = $1`,
      [notificationId]
    );

    if (existingNotification.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
        message: `No notification with id ${notificationId}`,
      });
    }

    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
      [notificationId]
    );
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const readAllNotificationsForUser = async (req, res, next) => {
  try {
    const recipientId = parseInt(req.params.recipientId);

    const recipientCheck = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [recipientId]
    );
    if (recipientCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipient Not Found',
        message: `No recipient found with id ${recipientId}`,
      });
    }

    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE recipient_id = $1 AND is_read = FALSE RETURNING *`,
      [recipientId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No unread notifications for recipient ${recipientId}`,
        notifications: [],
      });
    }

    res.status(200).json({
      success: true,
      message: `All notifications marked as read for recipient ${recipientId}`,
      notifications: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllNotificationsForUser,
  getUnreadNotificationsForUser,
  createNotification,
  readNotification,
  readAllNotificationsForUser,
  //   deleteNotification,
  //   deleteAllNotifications,
};
