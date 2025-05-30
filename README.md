# Souste Store: Backend

[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-brightgreen)](https://souste-social.netlify.app/)

This is a full stack social media web application, built as the final project for The Odin Project curriculum. The Node.js/Express API powers user authentication, posts, comments, friend interactions, messaging, and notifications through RESTful endpoints

Frontend Repository available here: https://github.com/souste/souste-social-frontend

## Tech Stack

- **Backend**: Node.js (v20), Express - for robust API development
- **Database**: PostgreSQL (v16) - for relational data storage
- **Authentication**: JWT (via jsonwebtoken), bcrypt - for secure user authentication
- **Media Management**: Cloudinary - for image uploads and optimization
- **Related Repository**: [Frontend](https://github.com/souste/souste-social-frontend) (React, Tailwind CSS)

## Features

All functionality is powered by RESTful API endpoints:

- User authentication: sign up, login, and logout.
- CRUD operations for posts and comments with timestamps
- Like and unlike posts and comments
- User profile management with edit functionality
- Image upload handling for posts and profile pictures via Cloudinary
- Friend system: send, cancel, accept, reject, and remove requests
- Private messaging between users with timestamps and CRUD operations
- Notifications for friend requests, comments, likes on posts and comments, and messages
- Server-side form validation with error handling for secure data processing
- Comprehensive error handling for all API endpoints (e.g. validation, authentication, and server errors)

## In Progress

- Adding real-time messaging and notifications using Socket.io

## Getting Started

Explore the [live demo](https://souste-social.netlify.app/) to test the app instantly (guest access available). To run the backend locally, follow these steps:

### Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- PostgreSQL (v16+)

### Steps

1. Clone this [repository](https://github.com/souste/souste-social-backend)
2. Install dependencies with `npm install`.
3. Create the database and run the schema file:
   - `createdb souste_social`
   - `psql souste_social < db/schema.sql`
   - Optional: seed the database with mock data using `node db/seed.js`
4. Configure backend environment variables in .env file:
   ```env
   - DATABASE_URL=<your_postgresql_url> (or local DB variables: user, host, database, password, port)
   - JWT_SECRET=<your_jwt_secret>
   - CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   - CLOUDINARY_API_KEY=<your_cloudinary_key>
   - CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   ```
5. Start the back end server: `node app.js` or `nodemon app.js`
