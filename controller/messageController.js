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

const getConversationWithFriend = async (req, res, next) => {
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
            SELECT * FROM messages 
            WHERE (user_id = $1 AND friend_id = $2)
            OR (user_id = $2 AND friend_id = $1)
            ORDER BY created_at ASC
            `,
      [userId, friendId]
    );

    if (messages.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No conversation found',
        message: `No conversation found between users ${userId} and ${friendId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: messages.rows,
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

const sendMessageToFriend = async (req, res, next) => {
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
    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getAllMessages,
  getConversationWithFriend,
  getMessageById,
  sendMessageToFriend,
};
