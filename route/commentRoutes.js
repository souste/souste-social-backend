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

const auth = require('../middleware/authMiddleware');

router.get('/', getAllCommentsByPost);
router.get('/:id', auth, getCommentByPost);
router.post('/', auth, createNewCommentByPost);
router.patch('/:id', auth, updateCommentByPost);
router.delete('/:id', auth, deleteCommentByPost);

router.post('/:commentId/like', auth, likeComment);
router.delete('/:commentId/unlike', auth, unlikeComment);
router.get('/:commentId/likes/count', auth, getTotalCommentLikes);

module.exports = router;
