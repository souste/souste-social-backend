const { Router } = require('express');
const router = Router({ mergeParams: true });
const {
  getAllCommentsByPost,
  getCommentByPost,
  createNewCommentByPost,
  updateCommentByPost,
  deleteCommentByPost,
} = require('../controller/commentController');

const {
  likeComment,
  unlikeComment,
  getTotalCommentLikes,
} = require('../controller/likeController');

router.get('/', getAllCommentsByPost);
router.get('/:id', getCommentByPost);
router.post('/', createNewCommentByPost);
router.patch('/:id', updateCommentByPost);
router.delete('/:id', deleteCommentByPost);

router.post('/:commentId/like', likeComment);
router.delete('/:commentId/unlike', unlikeComment);
router.get('/:commentId/likes/count', getTotalCommentLikes);

module.exports = router;
