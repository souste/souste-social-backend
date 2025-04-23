const { Router } = require('express');
const router = Router({ mergeParams: true });
const {
  getAllCommentsByPost,
  getCommentByPost,
  createNewCommentByPost,
  updateCommentByPost,
  deleteCommentByPost,
} = require('../controller/commentController');

router.get('/', getAllCommentsByPost);
router.get('/:id', getCommentByPost);
router.post('/', createNewCommentByPost);
router.patch('/:id', updateCommentByPost);
router.delete('/:id', deleteCommentByPost);

router.post('/:commentId/like', likeComment);
router.post('/:commentId/unlike', unlikeComment);

module.exports = router;
