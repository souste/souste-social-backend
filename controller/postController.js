const pool = require('../db/pool');
const { uploadImagePost } = require('../config/cloudinary');

const uploadMiddleware = uploadImagePost.single('image');

const getAllPosts = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, 
       users.username 
       FROM posts 
       JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC`
    );
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const getTimelinePosts = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    const result = await pool.query(
      ` SELECT
        cp.*,
        (SELECT COUNT(*)::int FROM comments c WHERE c.post_id = cp.id) AS comment_count,
        (SELECT COUNT(*)::int FROM likes    l WHERE l.post_id = cp.id) AS like_count,
        EXISTS (
        SELECT 1 FROM likes l2
        WHERE l2.post_id = cp.id AND l2.user_id = $1
    ) AS viewer_has_liked
      FROM (
       SELECT posts.*, users.username, profile.picture
       FROM friendship
       JOIN users ON users.id = friendship.friend_id
       JOIN posts ON posts.user_id = users.id
       JOIN profile ON profile.user_id = users.id
       WHERE friendship.user_id = $1 AND friendship.status = 'accepted'

       UNION

       SELECT posts.*, users.username, profile.picture
       FROM friendship
       JOIN users ON users.id = friendship.user_id
       JOIN posts ON posts.user_id = users.id
       JOIN profile ON profile.user_id = users.id
       WHERE friendship.friend_id = $1 AND friendship.status = 'accepted'

       UNION

       SELECT posts.*, users.username, profile.picture 
       FROM posts 
       JOIN users ON posts.user_id = users.id
       JOIN profile ON profile.user_id = users.id
       WHERE posts.user_id = $1 


       ) AS cp
       ORDER BY cp.created_at DESC`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No posts from friends available',
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows,
      message: result.rows.length
        ? 'Timeline retrieved successfully'
        : 'No posts in timeline',
    });
  } catch (err) {
    next(err);
  }
};

const getOwnPosts = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    const result = await pool.query(
      `SELECT
        p.*, u.username, pr.picture,
        (SELECT COUNT(*)::int FROM comments c WHERE c.post_id = p.id) AS comment_count,
        (SELECT COUNT(*)::int FROM likes    l WHERE l.post_id = p.id) AS like_count,
        EXISTS (
        SELECT 1 FROM likes l2
        WHERE l2.post_id = p.id AND l2.user_id = $1
    ) AS viewer_has_liked 
       FROM posts p 
       JOIN users u ON p.user_id = u.id
       LEFT JOIN profile pr ON pr.user_id = u.id
       WHERE p.user_id = $1 
       ORDER BY p.created_at DESC, p.id DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      message: result.rows.length
        ? 'User posts retrieved successfully'
        : 'No posts for this user',
    });
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT posts.*, users.username, profile.picture 
       FROM posts 
       JOIN users ON posts.user_id = users.id 
       JOIN profile ON profile.user_id = users.id
       WHERE posts.id = $1`,
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

const createNewPost = async (req, res, next) => {
  try {
    const { content, user_id } = req.body;
    let imagePath = null;

    if (!content && !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Post must either contain text content or an image',
      });
    }

    if (req.file) {
      imagePath = req.file.path;
    }

    const result = await pool.query(
      `INSERT INTO posts (content, user_id, image) VALUES ($1, $2, $3) RETURNING *`,
      [content, user_id, imagePath]
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
    const { content, image } = req.body;

    const checkPost = await pool.query('SELECT * FROM posts WHERE id = $1', [
      postId,
    ]);

    if (checkPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post Not Found',
        message: `No post found with id ${postId}`,
      });
    }
    const result = await pool.query(
      'UPDATE posts SET content = $1, image = $2, updated_at = Now() WHERE id = $3 RETURNING *',
      [content, image, postId]
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
        message: `No post found with id ${postId}`,
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

const uploadPostImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided',
      });
    }

    const postId = parseInt(req.params.id);

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
      `UPDATE posts SET image = $1 WHERE id = $2 returning *`,
      [req.file.path, postId]
    );

    res.status(200).json({
      success: true,
      data: {
        image: result.rows[0].image,
      },
      message: 'Post Image Uploaded Successfully',
    });
  } catch (err) {
    console.error('Error uploading post image', err);
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getTimelinePosts,
  getOwnPosts,
  getPost,
  createNewPost,
  updatePost,
  deletePost,
  uploadMiddleware,
  uploadPostImage,
};
