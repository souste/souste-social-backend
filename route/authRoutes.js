const { Router } = require('express');
const router = Router();
const authController = require('../controller/authController');
const {
  validateUser,
  validateLogin,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');

router.post(
  '/sign-up',
  validateUser,
  handleValidationErrors,
  authController.createNewUser
);

router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.loginUser
);

module.exports = router;
