const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const validateUser = [
  body('first_name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('First Name must be at least 3 letters')
    .isAlpha()
    .withMessage('First name must only contain letters'),
  body('last_name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Last Name must be at least 3 letters')
    .isAlpha()
    .withMessage('Last name only contain letters'),
  body('username')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters')
    .notEmpty()
    .withMessage('Username is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters'),
  body('confirm_password')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
];

const createNewUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
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
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, username, email, password) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, username, email, hashedPassword]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User Created Successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
};

module.exports = {
  validateUser,
  createNewUser,
};
