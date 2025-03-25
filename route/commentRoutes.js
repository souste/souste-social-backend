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

module.exports = router;
