const pool = require('./pool');
const bcrypt = require('bcryptjs');

const seedDB = async () => {
  try {
    console.log('Seeding Database');

    const hashedPassword = async (password) => await bcrypt.hash(password, 10);
    const hashedWoof123 = await hashedPassword('woof123');

    await pool.query('DELETE FROM comments');
    await pool.query('DELETE FROM posts');
    await pool.query('DELETE FROM profile');
    await pool.query('DELETE FROM users');

    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE posts_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE comments_id_seq RESTART WITH 1');

    await pool.query(
      `
      INSERT INTO users (first_name, last_name, username, email, password, role, created_at)
      VALUES
      ('Henry', 'of Skalitz', 'henska', 'henrys@outlook.com', $1, 'user', NOW()),
      ('Hans', 'Capon', 'hancap', 'hcapon@outlook.com', $1, 'user', NOW()),
      ('Katherine', 'Main Gal', 'katherine', 'katherine@outlook.com', $1, 'user', NOW()),
      ('Markvart', 'von Aulitz', 'markvart', 'markvart@outlook.com', $1, 'user', NOW()),
      ('Mutt', 'of Henry', 'mutt', 'mutt@outlook.com', $1, 'user', NOW()),
      ('Father', 'Godwin', 'godwin', 'godwin@outlook.com', $1, 'user', NOW()),
      ('Radzig', 'Kobyla', 'radzigk', 'radzig@outlook.com', $1, 'admin', NOW()),
      ('Hanush', 'of Leipa', 'hanushl', 'hanush@outlook.com', $1, 'user', NOW()),
      ('Divish', 'of Talmberg', 'divish', 'divish@outlook.com', $1, 'admin', NOW()),
      ('Erik', 'of Istvan', 'erikist', 'erik@outlook.com', $1, 'user', NOW()),
      ('Otto', 'von Bergow', 'ottber', 'otto@outlook.com', $1, 'user', NOW()),
      ('Istvan', 'Toth', 'isttoh', 'toth@outlook.com', $1, 'admin', NOW()),
      ('Johanka', 'of Sasau', 'johanka', 'johanka@outlook.com', $1, 'user', NOW()),
      ('Theresa', 'of Skalitz', 'theresa', 'theresa@outlook.com', $1, 'user', NOW()),
      ('Non', 'User', 'nonmember', 'anon@outlook.com', $1, 'user', NOW())
    `,
      [hashedWoof123]
    );

    await pool.query(`
      INSERT INTO profile (user_id, picture, bio, location, birth_date, occupation, friend_count)
      VALUES
      (1, 'https://res.cloudinary.com/demo/image/upload/henry_skalitz.jpg', 
       'Blacksmith''s son turned swordsman. Seeking justice for Skalitz.', 
       'Rattay', '1388-03-15', 'Adventurer', 5),
      (2, 'https://res.cloudinary.com/demo/image/upload/hans_capon.jpg', 
       'Noble brat with a bow. I hunt, I feast, I win.', 
       'Rattay', '1390-06-22', 'Nobleman', 8),
      (3, 'https://res.cloudinary.com/demo/image/upload/katherine.jpg', 
       'Survivor of Skalitz. Healing wounds and breaking hearts.', 
       'Rattay', '1389-09-10', 'Healer', 4),
      (4, 'https://res.cloudinary.com/demo/image/upload/markvart_aulitz.jpg', 
       'Iron fist of the realm. Mercy is for the weak.', 
       'Talmberg', '1365-11-05', 'Commander', 12),
      (5, 'https://res.cloudinary.com/demo/image/upload/mutt.jpg', 
       'Loyal hound. I sniff out trouble and chew on bandits.', 
       'Rattay', '1395-04-01', 'Dog', 3),
      (6, 'https://res.cloudinary.com/demo/image/upload/father_godwin.jpg', 
       'Priest with a pint. Gods word and ale guide me.', 
       'Uzhitz', '1360-02-14', 'Cleric', 6),
      (7, 'https://res.cloudinary.com/demo/image/upload/radzig_kobyla.jpg', 
       'Lord and mentor. Duty is my shield, honor my sword.', 
       'Rattay', '1355-08-20', 'Knight', 10),
      (8, 'https://res.cloudinary.com/demo/image/upload/hanush_leipa.jpg', 
       'Ruler of Rattay. I drink, I fight, I rule.', 
       'Rattay', '1350-12-30', 'Lord', 7),
      (9, 'https://res.cloudinary.com/demo/image/upload/divish_talmberg.jpg', 
       'Defender of Talmberg. A castle is only as strong as its lord.', 
       'Talmberg', '1358-05-17', 'Lord', 9),
      (10, 'https://res.cloudinary.com/demo/image/upload/erik_istvan.jpg', 
       'Mercenary with a vendetta. Gold buys my blade.', 
       'Sasau', '1375-09-18', 'Mercenary', 3),
      (11, 'https://res.cloudinary.com/demo/image/upload/otto_bergow.jpg', 
       'Knight of the old ways. Honor above all.', 
       'Sasau', '1368-07-25', 'Knight', 5),
      (12, 'https://res.cloudinary.com/demo/image/upload/istvan_toth.jpg', 
       'Cunning warlord. I take what I want, by force or guile.', 
       'Pribyslavitz', '1362-01-09', 'Warlord', 15),
      (13, 'https://res.cloudinary.com/demo/image/upload/johanka_sasau.jpg', 
       'Pious soul with a fiery spirit. I tend to the sick and the lost.', 
       'Sasau', '1385-11-11', 'Nun', 4),
      (14, 'https://res.cloudinary.com/demo/image/upload/theresa_skalitz.jpg', 
       'Millers lass with a brave heart. Skalitz lives in me.', 
       'Rattay', '1387-02-28', 'Miller', 6),
      (15, 'https://res.cloudinary.com/demo/image/upload/non_user.jpg', 
       'Wanderer with no name. I watch from the shadows.', 
       'Unknown', '1390-10-10', 'Stranger', 0)
    `);

    await pool.query(`
      INSERT INTO posts (content, created_at, updated_at, privacy, user_id)
      VALUES 
      ('A firsthand account of the horrors of war.', NOW(), NOW(), 'public', 1),
      ('A hunting trip that didnt go as planned.', NOW(), NOW(), 'public', 2),
      ('A sermon no one expected.', NOW(), NOW(), 'public', 6),
      ('The monks are hiding something...', NOW(), NOW(), 'public', 12),
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

    console.log('Database Successfully Seeded'); // Fixed message
  } catch (err) {
    console.error('Error Seeding Database', err);
  } finally {
    await pool.end();
    console.log('Database connection closed');
  }
};

seedDB();
