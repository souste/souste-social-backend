const { Router } = require('express');
const router = Router({ mergeParams: true });
const commentController = require('../controller/commentController');

router.get('/', commentController.getAllCommentsByPost);
router.get('/:id', commentController.getCommentByPost);
router.post('/', commentController.createNewCommentByPost);
// router.patch('/:id', commentController.updateCommentByPost);
// router.delete('/:id', commentController.deleteCommentByPost);

module.exports = router;
