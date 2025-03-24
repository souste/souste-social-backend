const { Router } = require('express');
const router = Router();
const authController = require('../controller/authController');

router.post(
  '/sign-up',
  authController.validateUser,
  authController.createNewUser
);

router.post('/login', authController.validateLogin, authController.loginUser);

module.exports = router;
