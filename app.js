const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = 'http://localhost:5173';

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const userRoutes = require('./route/userRoutes');
const postRoutes = require('./route/postRoutes');
const commentRoutes = require('./route/commentRoutes');
const authRoutes = require('./route/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/posts/:postId/comments', commentRoutes);
app.use('/api/v1/auth', authRoutes);
app.use((req, res, next) => {
  const error = new Error(`Route not found = ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`souste social - listening on PORT ${PORT}`);
});
