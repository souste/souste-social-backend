const pool = require('../db/pool');

const getAllMessages = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM messages`);
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const getAllConversations = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    const result = await pool.query(
      `
  WITH recent_messages AS (
  SELECT
  CASE
  WHEN user_id = $1 THEN friend_id
  ELSE user_id
  END AS other_user_id,
  MAX(created_at) as latest_message_time
  FROM messages
  WHERE user_id = $1 OR friend_id = $1
  GROUP BY other_user_id
  )
  SELECT users.id, users.username, users.first_name, users.last_name, profile.picture,
  (SELECT message FROM messages
  WHERE ((user_id = $1 AND friend_id = users.id) OR (user_id = users.id AND friend_id = $1))
  ORDER BY created_at DESC LIMIT 1) as latest_message,
  recent_messages.latest_message_time
  FROM recent_messages
  JOIN users ON recent_messages.other_user_id = users.id
  LEFT JOIN profile ON users.id = profile.user_id
  ORDER BY recent_messages.latest_message_time DESC
  `,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Conversations retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getConversationWithUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const usersCheck = await pool.query(
      `SELECT * FROM users WHERE id = $1 OR id = $2`,
      [userId, friendId]
    );

    if (usersCheck.rows.length < 2) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `One or both users not found with ids ${userId} and/or ${friendId}`,
      });
    }

    const messages = await pool.query(
      `
            SELECT messages.*,
            users.username
            FROM messages 
            JOIN users on messages.user_id = users.id
            WHERE (user_id = $1 AND friend_id = $2)
            OR (user_id = $2 AND friend_id = $1)
            ORDER BY created_at ASC
            `,
      [userId, friendId]
    );

    res.status(200).json({
      success: true,
      data: messages.rows || [],
    });
  } catch (err) {
    next(err);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const messageId = parseInt(req.params.messageId);

    const message = await pool.query(
      `
            SELECT * FROM messages WHERE user_id = $1 AND id = $2`,
      [userId, messageId]
    );

    if (message.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No message found',
        message: `No message with id ${messageId} found for user ${userId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: message.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'This message is empty',
      });
    }

    const friendCheck = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      friendId,
    ]);

    if (friendCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friend not found',
        message: `No friend found with id ${friendId}`,
      });
    }

    const result = await pool.query(
      `INSERT INTO messages (message, user_id, friend_id) VALUES ($1, $2, $3) RETURNING *`,
      [message, userId, friendId]
    );

    const userResult = await pool.query(
      `SELECT username FROM users WHERE id = $1`,
      [userId]
    );

    const createdMessage = result.rows[0];
    createdMessage.username = userResult.rows[0].username;

    res.status(201).json({
      success: true,
      data: createdMessage,
      message: 'Message Created Successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateUserMessage = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const messageId = parseInt(req.params.messageId);
    const { message } = req.body;

    const existingMessage = await pool.query(
      'SELECT * FROM messages WHERE user_id = $1 AND id = $2',
      [userId, messageId]
    );

    if (existingMessage.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
        message: `No message with id ${messageId} found for user ${userId}`,
      });
    }
    const result = await pool.query(
      `UPDATE messages SET message = $1, updated_at = Now() WHERE user_id = $2 AND id = $3 RETURNING *`,
      [message, userId, messageId]
    );
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const deleteUserMessage = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const messageId = parseInt(req.params.messageId);

    const existingMessage = await pool.query(
      'SELECT * FROM messages WHERE user_id = $1 AND id = $2',
      [userId, messageId]
    );

    if (existingMessage.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
        message: `No message with id ${messageId} found for user ${userId}`,
      });
    }
    await pool.query('DELETE FROM messages WHERE user_id = $1 AND id = $2', [
      userId,
      messageId,
    ]);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

const deleteConversationWithUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const usersCheck = await pool.query(
      `SELECT * FROM users WHERE id = $1 OR id = $2`,
      [userId, friendId]
    );
    if (usersCheck.rows.length < 2) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `One or both users not found with ids ${userId} and/or ${friendId}`,
      });
    }
    const result = await pool.query(
      `DELETE FROM messages WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
      [userId, friendId]
    );
    res.status(200).json({
      success: true,
      message: `${result.rowCount} message(s) deleted.`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllMessages,
  getAllConversations,
  getConversationWithUser,
  getMessageById,
  sendMessage,
  updateUserMessage,
  deleteUserMessage,
  deleteConversationWithUser,
};
