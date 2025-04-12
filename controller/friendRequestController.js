const pool = require('../db/pool');

const sendRequest = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Request',
        message: 'You cannot send a friend request to yourself',
      });
    }

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

    const existingFriendship = await pool.query(
      `SELECT * FROM friendship WHERE (user_id = $1 AND friend_id = $2) OR (user_id =$2 AND friend_id = $1)`,
      [userId, friendId]
    );

    if (existingFriendship.rows.length > 0) {
      const friendship = existingFriendship.rows[0];

      if (friendship.status === 'accepted') {
        return res.status(400).json({
          success: false,
          error: 'Already friends',
          message: 'You are aready friends with this user',
        });
      } else if (
        friendship.status === 'pending' &&
        friendship.user_id === userId
      ) {
        return res.status(400).json({
          success: false,
          error: 'Duplicate request',
          message: 'You have already sent a friend request to this user',
        });
      } else if (
        friendship.status === 'pending' &&
        friendship.friend_id === friendId
      ) {
        return res.status(400).json({
          success: false,
          error: 'Request exists',
          message:
            'This user has already sent you a friend request. Check your pending requests',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Friend request sent successfully',
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

const acceptRequest = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const result = await pool.query(
      `UPDATE friendship SET status = $1 WHERE user_id = $2 AND friend_id = $3 AND status = 'pending' RETURNING *`,
      ['accepted', friendId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
        message: 'No pending request found from this user',
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Friend Request Accepted Successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const rejectRequest = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const result = await pool.query(
      `UPDATE friendship SET status = $1 WHERE user_id = $2 AND friend_id = $3 AND status = 'pending' RETURNING *`,
      ['rejected', friendId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
        message: 'No pending request found from this user',
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Friend Request Rejected Successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
};
