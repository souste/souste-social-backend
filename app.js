const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

const userRoutes = require('./route/userRoutes');
const postRoutes = require('./route/postRoutes');
const commentRoutes = require('./route/commentRoutes');
const authRoutes = require('./route/authRoutes');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/posts/:postId/comments', commentRoutes);
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`souste social - listening on PORT ${PORT}`);
});
