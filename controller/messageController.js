const pool = require('../db/pool');

const sendMessageToFriend = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
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
  sendMessageToFriend,
};
