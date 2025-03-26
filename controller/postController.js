const pool = require('../db/pool');

const getAllPosts = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id'
    );
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const result = await pool.query(
      'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1',
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post Not Found',
        message: `No post found with ID ${postId}`,
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// can take user_id out of req.body once I'm using JWT web token

const createNewPost = async (req, res, next) => {
  try {
    const { content, user_id } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'This post is empty',
      });
    }
    const result = await pool.query(
      `INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *`,
      [content, user_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Post Created Successfully',
    });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const { content } = req.body;

    const checkPost = await pool.query('SELECT * FROM posts WHERE id = $1', [
      postId,
    ]);

    if (checkPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post Not Found',
        message: `No post found with if ${postId}`,
      });
    }
    const result = await pool.query(
      'UPDATE posts SET content = $1 WHERE id = $2 RETURNING *',
      [content, postId]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Post Updated Successfully',
    });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const checkPost = await pool.query('SELECT * FROM posts WHERE id = $1', [
      postId,
    ]);

    if (checkPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post Not Found',
        message: `No post found with if ${postId}`,
      });
    }
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createNewPost,
  updatePost,
  deletePost,
};
