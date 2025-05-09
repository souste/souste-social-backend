const { Router } = require('express');
const router = Router();
const {
  getAllPosts,
  getTimelinePosts,
  getOwnPosts,
  getPost,
  createNewPost,
  updatePost,
  deletePost,
  uploadMiddleware,
  uploadPostImage,
} = require('../controller/postController');

const {
  likePost,
  unlikePost,
  getTotalPostLikes,
} = require('../controller/likeController');
const auth = require('../middleware/authMiddleware');

router.get('/', getAllPosts);
router.get('/friends/:userId', auth, getTimelinePosts);
router.get('/own/:userId', auth, getOwnPosts);

router.get('/:id', auth, getPost);
router.post('/', auth, uploadMiddleware, createNewPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

router.post('/:id/image', auth, uploadMiddleware, uploadPostImage);

router.post('/:id/like', auth, likePost);
router.delete('/:id/unlike', auth, unlikePost);
router.get('/:id/likes/count', auth, getTotalPostLikes);

module.exports = router;
