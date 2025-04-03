const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const createNewUser = async (req, res, next) => {
  try {
    const { first_name, last_name, username, email } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with that email already exists',
      });
    }

    await pool.query('BEGIN');

    const userResult = await pool.query(
      `INSERT INTO users (first_name, last_name, username, email, password) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, username, email, hashedPassword]
    );

    const userId = userResult.rows[0].id;

    const profileResult = await pool.query(
      `INSERT INTO profile (user_id, picture, bio, location, birth_date, occupation, friend_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, '../assets/default-profile.JPG', '', '', null, '', 0]
    );

    await pool.query('COMMIT');

    const payload = {
      user: {
        id: userId,
        username: userResult.rows[0].username,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    const userData = {
      ...userResult.rows[0],
      profile: profileResult.rows[0],
    };

    res.status(201).json({
      success: true,
      data: { user: userData, token },
      message: 'User Created Successfully',
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    const { password: _, ...userData } = user;

    res.status(200).json({
      success: true,
      data: { user: userData, token },
      message: 'Login Successful',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//apply blacklisting here after MVP

const logoutUser = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided, cannot logout',
    });
  }

  res.status(200).json({
    success: true,
    data: null,
    message: 'Logout successful',
  });
};

module.exports = {
  createNewUser,
  loginUser,
  logoutUser,
};
