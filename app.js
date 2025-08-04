const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const pool = require('./db/pool');
const cors = require('cors');
require('dotenv').config();

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'https://souste-social.netlify.app'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
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
    socket.on('join', (userId) => {
      const room = String(userId);
      socket.join(room);
      console.log(`User ${userId} joined their personal room`);
    });
    console.log('New user connected');
    socket.on('send message', async ({ userId, friendId, message }) => {
      try {
        if (!message || message.trim() === '') {
          console.warn('Empty message blocked');
          return;
        }

        const friendCheck = await pool.query(
          `SELECT * FROM users WHERE id = $1`,
          [friendId]
        );

        if (friendCheck.rows.length === 0) {
          console.warn(`No friend found with id ${friendId}`);
          return;
        }

        const result = await pool.query(
          `INSERT INTO messages (user_id, friend_id, message) VALUES ($1, $2, $3) RETURNING id, message, created_at`,
          [userId, friendId, message]
        );

        const userResult = await pool.query(
          `SELECT username FROM users WHERE id = $1`,
          [userId]
        );

        const createdMessage = {
          id: result.rows[0].id,
          user_id: userId,
          friend_id: friendId,
          message: result.rows[0].message,
          created_at: result.rows[0].created_at,
          username: userResult.rows[0].username,
        };
        console.log('Emitting socket message:', createdMessage);
        io.emit('message', createdMessage);
      } catch (err) {
        console.error('Error inserting message:', err);
      }
    });

    socket.on(
      'send notification',
      async ({ recipientId, senderId, type, referenceId, message }) => {
        try {
          const validTypes = [
            'post',
            'comment',
            'message',
            'friend_request',
            'friend_accept',
            'like_post',
            'like_comment',
          ];

          if (!type || !validTypes.includes(type)) {
            console.warn('Invalid notification type');
            return;
          }

          const recipientCheck = await pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [recipientId]
          );
          if (recipientCheck.rows.length === 0) {
            console.warn(`No user found with id ${recipientId}`);
          }

          const senderCheck = await pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [senderId]
          );
          if (senderCheck.rows.length === 0) {
            console.warn(`No sender found with id ${senderId}`);
            return;
          }

          if (!recipientId || !referenceId || !message) {
            console.warn('recipientId, referenceId and message are required');
            return;
          }

          if (recipientId === senderId) {
            console.warn('Users cannot sent notifications to themselves');
            return;
          }

          const result = await pool.query(
            `INSERT INTO notifications(type, reference_id, message, recipient_id, sender_id)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [type, referenceId, message, recipientId, senderId]
          );

          const profileResult = await pool.query(
            `SELECT picture FROM profile where user_id = $1`,
            [senderId]
          );

          const createdNotification = {
            id: result.rows[0].id,
            recipient_id: recipientId,
            sender_id: senderId,
            type: result.rows[0].type,
            reference_id: result.rows[0].reference_id,
            message: result.rows[0].message,
            picture: profileResult.rows[0].picture,
            is_read: result.rows[0].is_read,
            created_at: result.rows[0].created_at,
          };

          io.emit('notification', createdNotification);
        } catch (err) {
          console.error('Error inserting notification', err);
        }
      }
    );

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
