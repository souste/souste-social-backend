const pool = require("./pool");

const seedDB = async () => {
  try {
    console.log("Seeding Database");

    await pool.query("DELETE FROM comments");
    await pool.query("DELETE FROM posts");
    await pool.query("DELETE FROM users");

    await pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE comments_id_seq RESTART WITH 1");

    await pool.query(`
            INSERT INTO users (first_name, last_name, username, email, password, role, created_at)
            VALUES
            ('Henry', 'of Skalitz', 'henska', 'henrys@outlook.com', 'woof123', 'user', NOW()),
            ('Hans', 'Capon', 'hancap', 'hcapon@outlook.com', 'woof123', 'user', NOW()),
            ('Katherine', 'Main Gal', 'katherine', 'katherine@outlook.com', 'woof123', 'user', NOW()),
            ('Markvart', 'von Aulitz', 'markvart', 'markvart@outlook.com', 'woof123', 'user', NOW()),
            ('Mutt', 'of Henry', 'mutt', 'mutt@outlook.com', 'woof123', 'user', NOW()),
            ('Father', 'Godwin', 'godwin', 'godwin@outlook.com', 'woof123', 'user', NOW()),
            ('Radzig', 'Kobyla', 'radzigk', 'radzig@outlook.com', 'woof123', 'admin', NOW()),
            ('Divish', 'of Talmberg', 'divish', 'divish@outlook.com', 'woof123', 'admin', NOW()),
            ('Erik', 'of Istvan', 'erikist', 'erik@outlook.com', 'woof123', 'user', NOW()),
            ('Otto', 'von Bergow', 'ottber', 'otto@outlook.com', 'woof123', 'user', NOW()),
            ('Istvan', 'Toth', 'isttoh', 'toth@outlook.com', 'woof123', 'admin', NOW()),
            ('Johanka', 'of Sasau', 'johanka', 'johanka@outlook.com', 'woof123', 'user', NOW()),
            ('Theresa', 'of Skalitz', 'theresa', 'theresa@outlook.com', 'woof123', 'user', NOW()),
            ('Non', 'User', 'Non Member', 'anon@outlook.com', 'anon123', 'user', NOW())
          `);

    await pool.query(`
            INSERT INTO posts (content, created_at, updated_at, privacy, user_id)
            VALUES 
          ('A firsthand account of the horrors of war.', NOW(), NOW(), 'public', 1),
          ('A hunting trip that didnt go as planned.', NOW(), NOW(), 'public', 2),
          ('A sermon no one expected.', NOW(), NOW(), 'public', 6),
          ('The monks are hiding something...', NOW(), NOW(), FALSE, 12),
          ('A fight for honor and revenge.', NOW(), NOW(), 'public', 9),
          ('Tales from the front lines.', NOW(), NOW(), 'public', 8),
          ('Tracking down a ruthless gang.', NOW(), NOW(), 'public', 3),
          ('Lessons from Sir Radzig.', NOW(), NOW(), 'public', 7),
          ('Retribution for Skalitz.', NOW(), NOW(), 'public', 4),
          ('Why every warrior needs a dog.', NOW(), NOW(), 'public', 5)
            `);

    await pool.query(`
                INSERT INTO comments (content, created_at, updated_at, user_id, post_id, parent_comment_id) 
                VALUES 
                ('This battle was a nightmare. I barely made it out alive.', NOW(), NOW(), 1, 1, NULL), 
                ('It really was a nightmare. Cannot believe it.', NOW(), NOW(), 1, 1, NULL), 
                ('And the start of a new adventure centered around revenge begins!', NOW(), NOW(), 1, 1, NULL), 
                ('Henry, you owe me another hunting trip!', NOW(), NOW(), 2, 2, NULL), 
                ('I never expected that from Father Godwin... what a sermon!', NOW(), NOW(), 6, 3, NULL), 
                ('The monastery is full of secrets... you should investigate.', NOW(), NOW(), 12, 4, NULL), 
                ('I challenged Erik to a duel. Best fight of my life.', NOW(), NOW(), 9, 5, NULL), 
                ('Talmberg was a fortress, but it fell. We must rebuild.', NOW(), NOW(), 8, 6, NULL), 
                ('Those bandits were tough, but we handled them.', NOW(), NOW(), 3, 7, NULL), 
                ('Sir Radzigs training changed my life.', NOW(), NOW(), 7, 8, NULL), 
                ('Markvart got what he deserved.', NOW(), NOW(), 4, 9, NULL), 
                ('A mans best friend, indeed. Mutt is the true hero.', NOW(), NOW(), 5, 10, NULL)
            `);

    console.log("Database Successfully Created");
  } catch (err) {
    console.error("Error Seeding Database", err);
  } finally {
    await pool.end();
    console.log("Database connection closed");
  }
};

seedDB();
