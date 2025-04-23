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

const { likePost, unlikePost } = require('../controller/likeController');
// const auth = require('../middleware/authMiddleware');

router.get('/', getAllPosts);
router.get('/friends/:userId', getFriendsPosts);
router.get('/own/:userId', getOwnPosts);

router.get('/:id', getPost);
router.post('/', createNewPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

router.post('/:id/like', likePost);
router.delete('/:id/unlike', unlikePost);

// router.get('/', auth, getAllPosts);

module.exports = router;
