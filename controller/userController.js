const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const { upload } = require('../config/cloudinary');

const uploadMiddleware = upload.single('image');

const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with id ${userId}`,
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { first_name, last_name, username, email, password } = req.body;

    const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    if (checkUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with id ${userId}`,
      });
    }

    let hashedPassword = checkUser.rows[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, username = $3, email = $4, password = $5 WHERE id = $6 RETURNING *`,
      [first_name, last_name, username, email, hashedPassword, userId]
    );
    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User Updated Successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    if (checkUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with id ${userId}`,
      });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.status(200).json({
      success: true,
      message: 'User Deleted Successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    const result = await pool.query(
      `SELECT profile.*,
      users.username, users.first_name, users.last_name, users.email, users.created_at 
      FROM profile
      JOIN users ON profile.user_id = users.id
      WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
        message: `No profile found for user with id ${userId}`,
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { picture, bio, location, birth_date, occupation, friend_count } =
      req.body;

    const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    if (checkUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with id ${userId}`,
      });
    }

    const profileCheck = await pool.query(
      `SELECT * FROM profile WHERE user_id = $1`,
      [userId]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Profile not found',
        message: `No profile found for user with id ${userId}`,
      });
    }

    const result = await pool.query(
      `UPDATE profile SET picture = $1, bio = $2, location = $3, birth_date = $4, occupation = $5, friend_count = $6 WHERE user_id = $7 RETURNING *`,
      [
        picture || '../assets/default-profile.JPG',
        bio || '',
        location || '',
        birth_date || null,
        occupation || '',
        friend_count || 0,
        userId,
      ]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Profile Updated Successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provides',
      });
    }

    const userId = parseInt(req.params.id);

    const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    if (checkUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: `No user found with id ${userId}`,
      });
    }

    const result = await pool.query(
      `UPDATE profile SET picture = $1 WHERE user_id = $2 RETURNING *`,
      [req.file.path, userId]
    );

    res.status(200).json({
      success: true,
      data: {
        picture: result.rows[0].picture,
      },
      message: 'Profile Image Updated Successfully',
    });
  } catch (err) {
    console.error('Error uploading profile image', err);
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadMiddleware,
};
