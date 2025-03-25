const { Router } = require('express');
const router = Router();
const {
  getAllPosts,
  getPost,
  createNewPost,
  updatePost,
  deletePost,
} = require('../controller/postController');
// const auth = require('../middleware/authMiddleware');

router.get('/', getAllPosts);
router.get('/:id', getPost);
router.post('/', createNewPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

// router.get('/', auth, getAllPosts);

module.exports = router;
