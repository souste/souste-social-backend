CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (255) NOT NULL, 
    last_name VARCHAR (255) NOT NULL,
    username VARCHAR (255) NOT NULL UNIQUE,
    email VARCHAR (255) UNIQUE,
    password VARCHAR (255) NOT NULL,
    role VARCHAR (50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    content TEXT NOT NULL,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    privacy VARCHAR(50) DEFAULT 'public',
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE DEFAULT NULL
);

CREATE TABLE profile (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    picture VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    birth_date DATE,
    occupation VARCHAR (255),
    friend_count INTEGER DEFAULT 0
);

CREATE TABLE friendship (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE DEFAULT NULL
);

CREATE TABLE likes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE NULL,
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT like_target_check CHECK (
        (post_id IS NULL AND comment_id IS NOT NULL) OR
        (post_id IS NOT NULL AND comment_id IS NULL)
    ),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, comment_id)
    
);

CREATE TABLE notifications (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('post', 'comment', 'message', 'friend_request', 'friend_accept', 'like_post', 'like_comment')),
    reference_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_notifications_recipient_id_created_at ON notifications(recipient_id, created_at DESC);
CREATE INDEX idx_notifications_recipient_id_is_read ON notifications(recipient_id, is_read);






