const { Router } = require('express');
const router = Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  uploadMiddleware,
  uploadProfileImage,
  getAllProfiles,
} = require('../controller/userController');

const auth = require('../middleware/authMiddleware');

router.get('/', auth, getAllUsers);
router.get('/profile', auth, getAllProfiles);

router.get('/:id', auth, getUser);
router.patch('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

router.get('/:id/profile', auth, getProfile);
router.patch(`/:id/profile`, auth, updateProfile);

router.post('/:id/profile/image', auth, uploadMiddleware, uploadProfileImage);

module.exports = router;
