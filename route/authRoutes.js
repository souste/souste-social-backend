const { Router } = require('express');
const router = Router();
const {
  createNewUser,
  loginUser,
  logoutUser,
} = require('../controller/authController');
const {
  validateUser,
  validateLogin,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');

router.post('/sign-up', validateUser, handleValidationErrors, createNewUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.post('/logout', logoutUser);

module.exports = router;
