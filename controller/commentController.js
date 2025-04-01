const pool = require('../db/pool');

const getAllCommentsByPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const postCheck = await pool.query('SELECT id FROM posts WHERE id = $1', [
      postId,
    ]);

    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post Not Found',
        message: `No post found with ID ${postId}`,
      });
    }

    const result = await pool.query(
      `SELECT comments.*, 
      users.username 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE post_id = $1 
      ORDER BY comments.created_at DESC`,
      [postId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Will I even need this one?
const getCommentByPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.id;

    const postCheck = await pool.query('SELECT id FROM posts WHERE id = $1', [
      postId,
    ]);

    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post Not Found',
        message: `No post found with ID ${postId}`,
      });
    }

    const result = await pool.query(
      'SELECT * FROM comments WHERE post_id = $1 AND id = $2',
      [postId, commentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Comment Not Found',
        message: `No comment found with id ${commentId}`,
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// can take user_id out of req.body once I'm using JWT web token

const createNewCommentByPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { content, user_id } = req.body;

    const postCheck = await pool.query('SELECT id FROM posts WHERE id = $1', [
      postId,
    ]);

    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post Not Found',
        message: `No post found with ID ${postId}`,
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Content is required',
      });
    }

    const result = await pool.query(
      `INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3) RETURNING *`,
      [content, user_id, postId]
    );

    const userResult = await pool.query(
      `SELECT username FROM users WHERE id = $1`,
      [user_id]
    );

    const createdComment = result.rows[0];
    createdComment.username = userResult.rows[0].username;

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Comment Created Successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateCommentByPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.id;
    const { content } = req.body;

    const commentCheck = await pool.query(
      'SELECT id FROM comments WHERE id = $1 AND post_id = $2',
      [commentId, postId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Not Found',
        message: `Comment with ID ${commentId} Not found`,
      });
    }

    const result = await pool.query(
      `UPDATE comments SET content = $1 WHERE id = $2 RETURNING *`,
      [content, commentId]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Comment Updated Successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteCommentByPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.id;

    const commentCheck = await pool.query(
      'SELECT id, post_id FROM comments WHERE id = $1 AND post_id = $2',
      [commentId, postId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Not Found',
        message: `Comment with ID ${commentId} Not found`,
      });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);

    res.status(200).json({
      success: true,
      message: 'Comment Deleted Successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getAllCommentsByPost,
  getCommentByPost,
  createNewCommentByPost,
  updateCommentByPost,
  deleteCommentByPost,
};
