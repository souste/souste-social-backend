const pool = require('../db/pool');

const sendRequest = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const checkFriend = await pool.query('SELECT * FROM users WHERE id = $1', [
      friendId,
    ]);

    if (checkFriend.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friend not found',
        message: `No friend found with id ${friendId}`,
      });
    }

    const result = await pool.query(
      `INSERT INTO friendship (user_id, friend_id, status) VALUES ($1, $2, $3) RETURNING *`,
      [userId, friendId, 'pending']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Friend Request Sent Successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendRequest,
};
