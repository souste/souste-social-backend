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
  ('Zara', 'Green', 'zarag', 'zaragreen@outlook.com', $1, 'user', NOW()),                  
  ('Sarah', 'Smith', 'ssmith97', 'sarahsmith@outlook.com', $1, 'user', NOW()),             
  ('Daniel', 'Carter', 'dcarter89', 'danielcarter@outlook.com', $1, 'user', NOW()),        
  ('Marcus', 'Johnson', 'marcusj', 'marcusjohnson@outlook.com', $1, 'user', NOW()),        
  ('Emily', 'Jones', 'emjones', 'emilyjones@outlook.com', $1, 'user', NOW()),              
  ('Xarnox', 'Zeta', 'xarnox', 'alienx@outlook.com', $1, 'user', NOW()),                    
  ('Jade', 'Williams', 'jadew', 'jadewilliams@outlook.com', $1, 'user', NOW()),            
  ('Sophia', 'Martinez', 'sophiam', 'sophiam@outlook.com', $1, 'user', NOW()),             
  ('Walter', 'Reed', 'waltr50', 'walterreed@outlook.com', $1, 'user', NOW()),              
  ('Mei', 'Chen', 'meichen', 'meichen@outlook.com', $1, 'user', NOW()),                    
  ('Chloe', 'Anderson', 'chloeand', 'chloeanderson@outlook.com', $1, 'user', NOW()),       
  ('Nia', 'Thomas', 'niathom', 'niathomas@outlook.com', $1, 'user', NOW()),                
  ('Pix', 'Elf', 'pixelface', 'pixel@outlook.com', $1, 'user', NOW()),                     
  ('Max', 'Capper', 'maxcap', 'maxcap@outlook.com', $1, 'user', NOW()),                    
  ('Tiana', 'Brooks', 'tbrooks', 'tianabrooks@outlook.com', $1, 'user', NOW()),            
  ('Lily', 'Hughes', 'lilhughes', 'lilyhughes@outlook.com', $1, 'user', NOW()),            
  ('Raj', 'Patel', 'rajp', 'rajpatel@outlook.com', $1, 'user', NOW()),                     
  ('Edith', 'Graves', 'edithg', 'edithgraves@outlook.com', $1, 'user', NOW()),             
  ('Leon', 'Loreli', 'leonloreli', 'leonloreli@outlook.com', $1, 'user', NOW()),           
  ('Asha', 'Kumar', 'ashak', 'ashakumar@outlook.com', $1, 'user', NOW()),                  
  ('Our', 'Guest', 'nonmember', 'anon@outlook.com', $1, 'user', NOW())                     
  `,
      [hashedWoof123]
    );

    await pool.query(`
  INSERT INTO profile (user_id, picture, bio, location, birth_date, occupation, friend_count)
  VALUES
  (1, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839159/souste-social-profile-pics/rfuam6gxoczena3kvkd7.png',
   'Music nerd and gym rat. Probably thinking about food.',
   'Leeds', '1995-03-15', 'Barista', 0),
  (2, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839221/souste-social-profile-pics/xpvqmdif0ygkrn5i6itv.jpg',
   'Sharp suit. Sharper wit. Navigating life with purpose and a little mystery.',
   'Manchester', '1997-06-22', 'Lawyer', 0),
  (3, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839263/souste-social-profile-pics/xmsu09d8k0qdu8os3qpc.jpg',
   'Mixed signals are my cardio.',
   'London', '1989-09-10', 'Graphic Designer', 0),
  (4, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839310/souste-social-profile-pics/cd2xqpzr1mx6ta57djcv.jpg',
   'Keep it simple, lift heavy.',
   'Glasgow', '1988-11-05', 'Personal Trainer', 0),
  (5, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839548/souste-social-profile-pics/dbhu9j8djd8kfadhchru.jpg',
   'Chasing light, angles, and big dreams.',
   'Rochdale', '2001-04-01', 'Model', 0),
  (6, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839652/souste-social-profile-pics/eeiydjofmtpdi4gowxp3.jpg',
   'Holy by day, cheeky pint by night.',
   'York', '1982-02-14', 'Vicar', 0),
  (7, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839704/souste-social-profile-pics/sdjufprusqlyxx2ptr3c.jpg',
   'Life’s a battlefield, dress accordingly.',
   'Birmingham', '1980-08-20', 'Veteran', 0),
  (8, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839744/souste-social-profile-pics/b6ehyphlwlitzamtk8cv.jpg',
   'Raising eyebrows and standards.',
   'Manchester', '1979-12-30', 'Public Speaker', 0),
  (9, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839774/souste-social-profile-pics/bdz6ud8miazajr2gfhgl.jpg',
   'Strong opinions, stronger coffee.',
   'Chester', '1971-05-17', 'Consultant', 0),
  (10, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839828/souste-social-profile-pics/yorh2aijecyfawgkfo9v.jpg',
    'Work hard, vanish harder.',
    'Sheffield', '1974-09-18', 'Freelancer', 0),
  (11, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839897/souste-social-profile-pics/owvx8ybfezsdbu1wxcm2.jpg',
   'I read ancient texts and lift weights.',
   'Durham', '1998-07-25', 'History Teacher', 0),
  (12, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747839946/souste-social-profile-pics/nyvitqhj4flgzg7jrkkt.png',
   'Built my empire from late nights and cold coffee.',
   'Liverpool', '1983-01-09', 'Entrepreneur', 0),
  (13, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747840002/souste-social-profile-pics/xgli86hwpfwsngadqbv3.png',
   'Caring soul with a wild streak.',
   'Nottingham', '1995-11-11', 'Care Worker', 0),
  (14, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747840036/souste-social-profile-pics/nkxdrigdihh5t9juemyp.png',
   'Northern girl with big dreams.',
   'Huddersfield', '1998-02-28', 'Baker', 0),
  (15, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747840069/souste-social-profile-pics/bulxuc1nfmejepd6bfwr.jpg',
   'Making moves in silence.',
   'London', '1980-02-14', 'CEO', 0),
  (16, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747840128/souste-social-profile-pics/zekueftsbe9plnve9ngx.jpg',
   'One eye on the prize, the other on my enemies.',
   'Bristol', '1996-06-10', 'Boxing Coach', 0),
  (17, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747840190/souste-social-profile-pics/zgbzyovfjilzd7ya5aip.jpg',
   'Live free, ride fast.',
   'Wales', '1990-04-20', 'Motorbike Mechanic', 0),
  (18, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747840221/souste-social-profile-pics/pjczk85ppbczxbkz7iju.png',
   'Retired, refined, and finally putting myself first.',
   'Newcastle', '1956-07-12', 'Retired', 0),
  (19, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747840329/souste-social-profile-pics/wq8dmrnqcjkrm1dec1uv.png',
   'Spears and sarcasm. That’s my vibe.',
   'Cardiff', '1978-03-05', 'Security Guard', 0),
  (20, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1747840428/souste-social-profile-pics/mrh6syd8huebc7zzesia.jpg',
   'Doctor by profession, human first.',
   'Derby', '1993-09-15', 'Doctor', 0),
  (21, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744210239/souste-social-profile-pics/xcqqaiimfjwdxvnxeunq.jpg',
   'Just visiting. Swiping through life.',
   'Unknown', '1990-10-10', 'Traveller', 0)
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
