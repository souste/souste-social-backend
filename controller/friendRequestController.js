const pool = require('../db/pool');

// Get Pending Requests
// Cancel Request

const getAllFriendships = async (req, res, next) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM friendship`
    );
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const getFriendStatus = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Request',
        message: 'You cannot be friends with yourself',
      });
    }

    const result = await pool.query(
      `
      SELECT * FROM friendship
      WHERE (user_id = $1 AND friend_id = $2) OR (friend_id = $1 AND user_id = $2)
      `,
      [userId, friendId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        status: 'none',
      });
    }

    res.status(200).json({
      success: true,
      status: result.rows[0].status,
    });
  } catch (err) {
    next(err);
  }
};

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

const cancelRequest = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    const checkRequest = await pool.query(
      `
      SELECT * FROM friendship
      WHERE user_id = $1 AND friend_id = $2 AND status = 'pending'
      `,
      [userId, friendId]
    );

    if (checkRequest.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friendship not found',
        message: `No pending request found between user ${userId} and friend ${friendId}`,
      });
    }

    await pool.query(
      `
      DELETE FROM friendship 
      WHERE user_id = $1 AND friend_id = $2 AND status = 'pending'
      `,
      [userId, friendId]
    );

    res.status(200).json({
      success: true,
      message: 'Friend request cancelled successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const unfriend = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);

    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Request',
        message: 'You cannot unfriend yourself',
      });
    }

    const friendship = await pool.query(
      `SELECT * FROM friendship WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)) AND status = $3`,
      [userId, friendId, 'accepted']
    );

    if (friendship.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friendship not found',
        message: 'No active friendship found with this user',
      });
    }

    await pool.query(`DELETE FROM friendship WHERE id = $1`, [
      friendship.rows[0].id,
    ]);

    res.status(200).json({
      success: true,
      message: 'Unfriended friend successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getFriends = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    const friends = await pool.query(
      `
      SELECT users.id, users.username, users.first_name, users.last_name,  profile.picture, friendship.created_at as friends_since
      FROM friendship
      JOIN users ON ((friendship.user_id = users.id AND friendship.friend_id = $1) OR (friendship.friend_id = users.id AND friendship.user_id = $1))
      LEFT JOIN profile ON users.id = profile.user_id
      WHERE friendship.status = 'accepted' AND users.id != $1
      `,
      [userId]
    );

    if (friends.rows.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'User has no friends yet',
      });
    }

    res.status(200).json({
      success: true,
      count: friends.rows.length,
      data: friends.rows,
      message: 'Friends retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllFriendships,
  getFriendStatus,
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  unfriend,
  getFriends,
};
