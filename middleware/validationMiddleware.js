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
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),
  body('confirm_password')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateUser,
  validateLogin,
  handleValidationErrors,
};
