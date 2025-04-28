const { Router } = require('express');
const router = Router();
const {
  getAllPosts,
  getFriendsPosts,
  getOwnPosts,
  getPost,
  createNewPost,
  updatePost,
  deletePost,
} = require('../controller/postController');

const {
  likePost,
  unlikePost,
  getTotalPostLikes,
} = require('../controller/likeController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getAllPosts);
router.get('/friends/:userId', auth, getFriendsPosts);
router.get('/own/:userId', auth, getOwnPosts);

router.get('/:id', auth, getPost);
router.post('/', auth, createNewPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

router.post('/:id/like', auth, likePost);
router.delete('/:id/unlike', auth, unlikePost);
router.get('/:id/likes/count', getTotalPostLikes);

module.exports = router;
