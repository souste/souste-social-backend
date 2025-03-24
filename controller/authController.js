const pool = require('../db/pool');

const createNewUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with that email already exists',
      });
    }
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, username, email, password) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, username, email, password]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User Created Successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
};

module.exports = {
  createNewUser,
};
