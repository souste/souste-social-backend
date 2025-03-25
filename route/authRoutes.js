const { Router } = require('express');
const router = Router();
const { createNewUser, loginUser } = require('../controller/authController');
const {
  validateUser,
  validateLogin,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');

router.post('/sign-up', validateUser, handleValidationErrors, createNewUser);

router.post('/login', validateLogin, handleValidationErrors, loginUser);

module.exports = router;
