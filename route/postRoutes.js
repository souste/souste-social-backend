const { Router } = require('express');
const router = Router();
const postController = require('../controller/postController');
// const auth = require('../middleware/authMiddleware');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);
router.post('/', postController.createNewPost);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// router.get('/', auth, postController.getAllPosts);

module.exports = router;
