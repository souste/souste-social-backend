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
      ('Sigismund', 'of Luxembourg', 'siglux', 'sigismund@outlook.com', $1, 'admin', NOW()),
      ('Jan', 'Žižka', 'janziz', 'zizka@outlook.com', $1, 'user', NOW()),
      ('Dry', 'Devil', 'drydevil', 'drydevil@outlook.com', $1, 'user', NOW()),
      ('Kubyenka', 'Novakova', 'kubyenka', 'kubyenka@outlook.com', $1, 'user', NOW()),
      ('Musa', 'Ibn Khalid', 'musa', 'musa@outlook.com', $1, 'user', NOW()),
      ('Samuel', 'of Martin', 'samuel', 'samuel@outlook.com', $1, 'user', NOW()),
      ('Jobst', 'of Moravia', 'marjob', 'jobst@outlook.com', $1, 'admin', NOW()),
      ('Rosa', 'Ruthard', 'rosa', 'rosa@outlook.com', $1, 'user', NOW()),
      ('Non', 'User', 'nonmember', 'anon@outlook.com', $1, 'user', NOW())
    `,
      [hashedWoof123]
    );

    await pool.query(`
      INSERT INTO profile (user_id, picture, bio, location, birth_date, occupation, friend_count)
      VALUES
      (1, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198105/souste-social-profile-pics/k1rbq9fpy3xaqb6k81lx.jpg', 
       'Blacksmith''s son turned swordsman. Seeking justice for Skalitz.', 
       'Rattay', '1388-03-15', 'Adventurer', 0),
      (2, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1745065414/souste-social-profile-pics/h7lhysukvqalajemqtv9.jpg', 
       'Noble brat with a bow. I hunt, I feast, I win.', 
       'Rattay', '1390-06-22', 'Nobleman', 0),
      (3, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198191/souste-social-profile-pics/ld7y6ttdsfqn29x4vxjg.jpg', 
       'Skilled Spy. Healing wounds and breaking hearts.', 
       'Troskowitz', '1389-09-10', 'Spy', 0),
      (4, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198341/souste-social-profile-pics/f80fuxadlja8jyqkbzih.jpg', 
       'Iron fist of the realm. Mercy is for the weak.', 
       'Germany', '1365-11-05', 'Commander', 0),
      (5, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198877/souste-social-profile-pics/piopz2dl5xoajmagc2dd.jpg', 
       'Loyal hound. I sniff out trouble and chew on bandits.', 
       'Rattay', '1395-04-01', 'Dog', 0),
      (6, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198914/souste-social-profile-pics/uj3dqzxizyejhr1yxgef.jpg', 
       'Priest with a pint. Gods word and ale guide me.', 
       'Uzhitz', '1360-02-14', 'Cleric', 0),
      (7, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198946/souste-social-profile-pics/cz7t2aktci60bz3feh66.jpg', 
       'Lord and mentor. Duty is my shield, honor my sword.', 
       'Rattay', '1355-08-20', 'Knight', 0),
      (8, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198974/souste-social-profile-pics/o310jfj08aintpjfmskz.jpg', 
       'Ruler of Rattay. I drink, I fight, I rule.', 
       'Rattay', '1350-12-30', 'Lord', 0),
      (9, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199000/souste-social-profile-pics/rag4tlbktncyxr3a2fne.jpg', 
       'Defender of Talmberg. A castle is only as strong as its lord.', 
       'Talmberg', '1358-05-17', 'Lord', 0),
      (10, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199030/souste-social-profile-pics/b0elbezsxhgfea5ssogj.jpg', 
       'Mercenary with a vendetta. Gold buys my blade.', 
       'Sasau', '1375-09-18', 'Mercenary', 0),
      (11, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199057/souste-social-profile-pics/chibxwegup0gkmonxq8b.jpg', 
       'Knight of the old ways. Honor above all.', 
       'Sasau', '1368-07-25', 'Knight', 0),
      (12, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199095/souste-social-profile-pics/snz1py28tswpllwks66k.jpg', 
       'Cunning warlord. I take what I want, by force or guile.', 
       'Pribyslavitz', '1362-01-09', 'Warlord', 0),
      (13, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199121/souste-social-profile-pics/qvnt1orsxrjdjygijde3.jpg', 
       'Pious soul with a fiery spirit. I tend to the sick and the lost.', 
       'Sasau', '1385-11-11', 'Nun', 0),
      (14, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199152/souste-social-profile-pics/tagyhicoy78hoeqqxfph.jpg', 
       'Millers lass with a brave heart. Skalitz lives in me.', 
       'Rattay', '1387-02-28', 'Miller', 0),
      (15, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372159/souste-social-profile-pics/fd6vsz61v26u1pzzmgpm.jpg', 
       'Emperor and conqueror. The crown bends to my will.', 
       'Hungary', '1368-02-14', 'Emperor', 0),
      (16, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372261/souste-social-profile-pics/kmaobmlppb4e7bwpkjwr.jpg', 
       'One-eyed warrior. I fight for the people, not the crown.', 
       'Kutna Hora', '1360-06-10', 'Commander', 0),
      (17, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372331/souste-social-profile-pics/dejrhsgi1dj824oqfgj9.jpg', 
       'Outlaw of the woods. Fear my name in the shadows.', 
       'Bohemian Forest', '1370-04-20', 'Bandit', 0),
      (18, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372492/souste-social-profile-pics/srgmyuzhigwe6nqedhjt.jpg', 
       'Cunning lass with a sharp tongue and sharper blade.', 
       'Kutna Hora', '1385-07-12', 'Thief', 0),
      (19, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372560/souste-social-profile-pics/v0gcgy6ltw50onnz5xo8.jpg', 
       'Traveler from afar. My spear speaks when words fail.', 
       'Kutna Hora', '1378-03-05', 'Mercenary', 0),
      (20, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372634/souste-social-profile-pics/rncumnlzcky9ptjifyci.jpg', 
       'Son of Martin, I forge steel and secrets with a quiet hammer.', 
       'Sasau', '1380-09-15', 'Blacksmith', 0),
      (21, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372708/souste-social-profile-pics/dm3tumf83scfl1bv8pm4.jpg', 
       'Margrave with ambition. Power is my birthright.', 
       'Moravia', '1354-12-01', 'Noble', 0),
      (22, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372769/souste-social-profile-pics/ltvi9exleglukcg7jfr9.jpg', 
       'A rose in a harsh world, I mend what’s broken.', 
       'Kutna Hora', '1386-05-25', 'Healer', 0),
      (23, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744210239/souste-social-profile-pics/xcqqaiimfjwdxvnxeunq.jpg', 
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

    console.log('Database Successfully Seeded');
  } catch (err) {
    console.error('Error Seeding Database', err);
  } finally {
    await pool.end();
    console.log('Database connection closed');
  }
};

seedDB();
