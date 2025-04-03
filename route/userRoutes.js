const { Router } = require('express');
const router = Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} = require('../controller/userController');

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

router.get('/:id/profile', getProfile);
router.patch(`/:id/profile`, updateProfile);

module.exports = router;
