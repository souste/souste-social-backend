const pool = require('../db/pool');

const likePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const checkPost = await pool.query('SELECT * FROM posts WHERE id = $1', [
      postId,
    ]);

    if (checkPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        message: `No post found with id ${postId}`,
      });
    }

    const result = await pool.query(
      `INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *`,
      [postId, userId]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Post Liked Successfully',
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this post',
      });
    }
    next(err);
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const checkPost = await pool.query('SELECT * FROM posts WHERE id = $1', [
      postId,
    ]);

    if (checkPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        message: `No post found with id ${postId}`,
      });
    }

    const checkLike = await pool.query(
      'SELECT * FROM likes where post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (checkLike.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Like not found',
        message: `You have not liked this post`,
      });
    }

    await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [
      postId,
      userId,
    ]);

    res.status(200).json({
      success: true,
      message: 'Like removed successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getTotalPostLikes = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const checkPost = await pool.query('SELECT * FROM posts WHERE id = $1', [
      postId,
    ]);

    if (checkPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        message: `No post found with id ${postId}`,
      });
    }

    const result = await pool.query(
      `SELECT COUNT(*) AS like_count,
      EXISTS (
      SELECT 1
      FROM likes
      WHERE user_id = $1 AND post_id = $2
      ) AS liked_by_user
      FROM likes WHERE post_id = $2`,
      [userId, postId]
    );

    res.status(200).json({
      success: true,
      count: parseInt(result.rows[0].like_count),
      likedByUser: result.rows[0].liked_by_user,
      message: 'Post likes count retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.id;

    const commentCheck = await pool.query(
      'SELECT * FROM comments WHERE id = $1 AND post_id = $2',
      [commentId, postId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'not_found',
        message: `Comment with ID ${commentId} not found for post ${postId}`,
      });
    }

    const result = await pool.query(
      `INSERT INTO likes (comment_id, user_id) VALUES ($1, $2) RETURNING *`,
      [commentId, userId]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Comment liked Successfully',
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this comment',
      });
    }
    next(err);
  }
};

const unlikeComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.id;

    const commentCheck = await pool.query(
      'SELECT * FROM comments WHERE id = $1 AND post_id = $2',
      [commentId, postId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'not_found',
        message: `Comment with ID ${commentId} not found for post ${postId}`,
      });
    }

    const checkLike = await pool.query(
      'SELECT * FROM likes where comment_id = $1 AND user_id = $2',
      [commentId, userId]
    );

    if (checkLike.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Like not found',
        message: `You have not liked this comment`,
      });
    }

    await pool.query(
      `DELETE FROM likes WHERE comment_id = $1 AND user_id = $2`,
      [commentId, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Like removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getTotalCommentLikes = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.id;

    const commentCheck = await pool.query(
      `SELECT * FROM comments WHERE id = $1 AND post_id = $2`,
      [commentId, postId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Comment with ID ${commentId} not found for post ${postId}`,
      });
    }

    const result = await pool.query(
      `SELECT COUNT(*) AS like_count,
      EXISTS (
      SELECT 1
      FROM likes
      WHERE user_id =$1 AND comment_id = $2
      ) AS liked_by_user
      from likes WHERE comment_id = $2`,
      [userId, commentId]
    );

    res.status(200).json({
      success: true,
      count: parseInt(result.rows[0].like_count),
      likedByUser: result.rows[0].liked_by_user,
      message: 'Comment like count retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  likePost,
  unlikePost,
  getTotalPostLikes,
  likeComment,
  unlikeComment,
  getTotalCommentLikes,
};
