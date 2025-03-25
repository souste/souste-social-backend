const { Router } = require('express');
const router = Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controller/userController');

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
