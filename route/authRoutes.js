const { Router } = require('express');
const router = Router();
const authController = require('../controller/authController');

router.post(
  '/sign-up',
  authController.validateUser,
  authController.createNewUser
);

module.exports = router;
