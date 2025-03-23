const { Router } = require('express');
const router = Router();
const postController = require('../controller/postController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);
router.post('/', postController.createNewPost);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
