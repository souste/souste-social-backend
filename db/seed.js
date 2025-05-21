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
  (1, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198105/souste-social-profile-pics/k1rbq9fpy3xaqb6k81lx.jpg',
   'Music nerd and gym rat. Probably thinking about food.',
   'Leeds', '1995-03-15', 'Barista', 0),
  (2, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1745065414/souste-social-profile-pics/h7lhysukvqalajemqtv9.jpg',
   'Just a gal adventuring the world.',
   'Manchester', '1997-06-22', 'Nurse', 0),
  (3, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198191/souste-social-profile-pics/ld7y6ttdsfqn29x4vxjg.jpg',
   'Mixed signals are my cardio.',
   'London', '1996-09-10', 'Graphic Designer', 0),
  (4, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198341/souste-social-profile-pics/f80fuxadlja8jyqkbzih.jpg',
   'Keep it simple, lift heavy.',
   'Glasgow', '1988-11-05', 'Personal Trainer', 0),
  (5, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198877/souste-social-profile-pics/piopz2dl5xoajmagc2dd.jpg',
   'Just your local resident DJ.',
   'Rochdale', '2018-04-01', 'Dog', 0),
  (6, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198914/souste-social-profile-pics/uj3dqzxizyejhr1yxgef.jpg',
   'Holy by day, cheeky pint by night.',
   'York', '1982-02-14', 'Vicar', 0),
  (7, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198946/souste-social-profile-pics/cz7t2aktci60bz3feh66.jpg',
   'Life’s a battlefield, dress accordingly.',
   'Birmingham', '1980-08-20', 'Veteran', 0),
  (8, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744198974/souste-social-profile-pics/o310jfj08aintpjfmskz.jpg',
   'Raising eyebrows and standards.',
   'Manchester', '1979-12-30', 'Public Speaker', 0),
  (9, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199000/souste-social-profile-pics/rag4tlbktncyxr3a2fne.jpg',
   'Strong opinions, stronger coffee.',
   'Chester', '1981-05-17', 'Consultant', 0),
  (10, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199030/souste-social-profile-pics/b0elbezsxhgfea5ssogj.jpg',
    'Work hard, vanish harder.',
    'Sheffield', '1990-09-18', 'Freelancer', 0),
  (11, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199057/souste-social-profile-pics/chibxwegup0gkmonxq8b.jpg',
   'I read ancient texts and lift weights.',
   'Durham', '1987-07-25', 'History Teacher', 0),
  (12, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199095/souste-social-profile-pics/snz1py28tswpllwks66k.jpg',
   'Built my empire from late nights and cold coffee.',
   'Liverpool', '1983-01-09', 'Entrepreneur', 0),
  (13, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199121/souste-social-profile-pics/qvnt1orsxrjdjygijde3.jpg',
   'Caring soul with a wild streak.',
   'Nottingham', '1995-11-11', 'Care Worker', 0),
  (14, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744199152/souste-social-profile-pics/tagyhicoy78hoeqqxfph.jpg',
   'Northern girl with big dreams.',
   'Huddersfield', '1998-02-28', 'Baker', 0),
  (15, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372159/souste-social-profile-pics/fd6vsz61v26u1pzzmgpm.jpg',
   'Making moves in silence.',
   'London', '1980-02-14', 'CEO', 0),
  (16, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372261/souste-social-profile-pics/kmaobmlppb4e7bwpkjwr.jpg',
   'One eye on the prize, the other on my enemies.',
   'Bristol', '1982-06-10', 'Boxing Coach', 0),
  (17, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372331/souste-social-profile-pics/dejrhsgi1dj824oqfgj9.jpg',
   'Live free, ride fast.',
   'Wales', '1990-04-20', 'Motorbike Mechanic', 0),
  (18, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372492/souste-social-profile-pics/srgmyuzhigwe6nqedhjt.jpg',
   'Quick hands, quicker wit.',
   'Newcastle', '1996-07-12', 'Bartender', 0),
  (19, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372560/souste-social-profile-pics/v0gcgy6ltw50onnz5xo8.jpg',
   'Spears and sarcasm. That’s my vibe.',
   'Cardiff', '1991-03-05', 'Security Guard', 0),
  (20, 'https://res.cloudinary.com/dbkarqkym/image/upload/v1744372634/souste-social-profile-pics/rncumnlzcky9ptjifyci.jpg',
   'I fix metal and messes.',
   'Derby', '1993-09-15', 'Welder', 0),
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
