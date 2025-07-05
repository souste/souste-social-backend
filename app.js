const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const pool = require('../db/pool');
const cors = require('cors');
require('dotenv').config();

async function main() {
  // Need sql db logic here

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
  });

  const allowedOrigins = [
    'http://localhost:5173',
    'https://souste-social.netlify.app',
  ];

  app.use(cors({ origin: allowedOrigins, credentials: true }));

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('send message', async ({ userId, friendId, message }) => {
      try {
        const result = await pool.query(
          `INSERT INTO messages (user_id, friend_id, message) VALUES ($1, $2, $3) RETURNING id, created_at`,
          [userId, friendId, message]
        );
        io.emit('message', {
          userId,
          friendId,
          message,
          messageId: result.rows[0].id,
          createdAt: result.rows[0].created_at,
        });
      } catch (err) {
        console.error('Error inserting message:', err);
      }
    });
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  const userRoutes = require('./route/userRoutes');
  const postRoutes = require('./route/postRoutes');
  const commentRoutes = require('./route/commentRoutes');
  const authRoutes = require('./route/authRoutes');
  const friendRequestRoutes = require('./route/friendRequestRoutes');
  const messageRoutes = require('./route/messageRoutes');
  const notificationRoutes = require('./route/notificationRoutes');
  const errorHandler = require('./middleware/errorMiddleware');

  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/posts', postRoutes);
  app.use('/api/v1/posts/:postId/comments', commentRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/friendRequest', friendRequestRoutes);
  app.use('/api/v1/messages', messageRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.use((req, res, next) => {
    const error = new Error(`Route not found = ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  });
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`souste social - listening on PORT ${PORT}`);
  });
}

main();
