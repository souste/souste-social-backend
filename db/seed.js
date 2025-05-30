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
    await pool.query('DELETE FROM friendship');
    await pool.query('DELETE FROM users');

    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE posts_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE comments_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE friendship_id_seq RESTART WITH 1');

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
   'London', '1989-09-10', 'Software Developer', 0),
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
  INSERT INTO friendship (user_id, friend_id, status, created_at)
  VALUES
      (1, 2, 'accepted', NOW()),  
      (1, 3, 'accepted', NOW()),  
      (2, 4, 'accepted', NOW()),  
      (5, 1, 'accepted', NOW()),  
      (6, 1, 'accepted', NOW()),  
      (14, 1, 'accepted', NOW()), 
      (7, 1, 'accepted', NOW()),  
      (1, 16, 'accepted', NOW()),
      (21, 1, 'accepted', NOW()), 
      (21, 2, 'accepted', NOW()),  
      (21, 6, 'accepted', NOW()),
      (21, 7, 'accepted', NOW()), 
      (21, 9, 'accepted', NOW()),  
      (21, 12, 'accepted', NOW()),  
      (21, 8, 'accepted', NOW()),
      (21, 4, 'accepted', NOW()), 
      (21, 5, 'accepted', NOW()), 
      (11, 21, 'accepted', NOW())
  `);

    await pool.query(`
  UPDATE profile
  SET friend_count = sub.count
  FROM (
    SELECT user_id, COUNT(*) as count
    FROM (
      SELECT user_id FROM friendship WHERE status = 'accepted'
      UNION ALL
      SELECT friend_id FROM friendship WHERE status = 'accepted'
    ) AS all_friends
    GROUP BY user_id
  ) AS sub
  WHERE profile.user_id = sub.user_id
`);

    await pool.query(`
  INSERT INTO posts (content, image, created_at, updated_at, privacy, user_id)
  VALUES 
  ('Just wrapped up my first week in the new city. Feels like a fresh start.', 
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747918576/souste-social-post-images/kjshtbbomunzpkrk7aqj.jpg', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', 'public', 1),
  ('Hiked the Peaks solo today. Needed that headspace reset.',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747918186/souste-social-post-images/nw7lf1lsocfboaa7lwib.jpg', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', 'public', 2),
  ('Trying to cut down on caffeine but flat whites keep calling my name.',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747918421/souste-social-post-images/znmxmwd0zcjnyxe0bw2m.png', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', 'public', 6),
  ('Anyone else getting obsessed with cold water dips lately?',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747919824/souste-social-post-images/yyopirt7ukdlgyv0llpd.jpg', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', 'public', 12),
  ('Sauron, created by AI!.',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747918962/souste-social-post-images/uxi9qvpb8kmvwcega5kx.jpg', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', 'public', 9),
  ('Running clears my mind like nothing else. 10k before sunrise today.',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747919691/souste-social-post-images/xb3ljfqpnxsawnk7x4ef.jpg', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', 'public', 8),
  ('Just finished a React project I’m actually proud of. Big step forward.',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747918818/souste-social-post-images/efvpdlkksw1olbgy58ty.jpg', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', 'public', 3),
  ('My cat Henry x.',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747919309/souste-social-post-images/v2gtmmattef5pmnxhunk.jpg', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 'public', 7),
  ('Tough week mentally, but still standing. That’s something.',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747918317/souste-social-post-images/ndysiogiqabodrrentst.jpg', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'public', 4),
  ('Off to Ibiza this weekend, cannot wait!',
  'https://res.cloudinary.com/dbkarqkym/image/upload/v1747919554/souste-social-post-images/cgqxmayyqxzxphzbb0fm.jpg', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'public', 5)
`);

    await pool.query(`
      INSERT INTO comments (content, created_at, updated_at, user_id, post_id, parent_comment_id) 
      VALUES 
      ('Big moves! Fresh starts are everything. How are you finding it so far?', NOW(), NOW(), 2, 1, NULL), 
      ('New city energy hits different. Excited for your next chapter!', NOW(), NOW(), 6, 1, NULL), 
      ('Change of scenery does wonders for the soul. Good for you!', NOW(), NOW(), 7, 1, NULL), 
      ('Solo hikes are the best therapy. The Peaks are stunning this time of year.', NOW(), NOW(), 1, 2, NULL), 
      ('The struggle is real! Maybe try oat milk cortados as a compromise?', NOW(), NOW(), 1, 3, NULL), 
      ('Yes! Started doing them last month and I am addicted. Game changer for mental clarity.', NOW(), NOW(), 9, 4, NULL), 
      ('This is incredible! What AI tool did you use? The detail is insane.', NOW(), NOW(), 3, 5, NULL), 
      ('10k before sunrise is dedication! Running is pure meditation in motion.', NOW(), NOW(), 4, 6, NULL), 
      ('React projects that you are proud of are the best feeling. What did you build?', NOW(), NOW(), 12, 7, NULL), 
      ('Henry is gorgeous! Cats really know how to live their best life.', NOW(), NOW(), 5, 8, NULL), 
      ('You are stronger than you know. Some weeks test us but we keep going.', NOW(), NOW(), 20, 9, NULL), 
      ('Ibiza vibes! Have the best time, you deserve it after this week.', NOW(), NOW(), 8, 10, NULL)
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
