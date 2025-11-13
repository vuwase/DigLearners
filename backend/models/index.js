// Database Models Index - Sets up all models and relationships
const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration
const logging = process.env.NODE_ENV === 'development' ? console.log : false;
const isPostgres = (process.env.DB_DIALECT || '').toLowerCase() === 'postgres';
const useDatabaseUrl = Boolean(process.env.DATABASE_URL);

const defineOptions = {
  timestamps: true,
  underscored: true,
  freezeTableName: true
};

const getDialectOptions = () => {
  if (!isPostgres) {
    return {};
  }

  const sslRequired = (process.env.DB_SSL || 'true').toLowerCase() === 'true';
  if (!sslRequired) {
    return {};
  }

  return {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
};

let sequelize;

if (useDatabaseUrl) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging,
    define: defineOptions,
    dialectOptions: getDialectOptions()
  });
} else if (isPostgres) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      dialect: 'postgres',
      logging,
      define: defineOptions,
      dialectOptions: getDialectOptions()
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'test'
      ? ':memory:'
      : path.join(__dirname, '../../data/diglearners.db'),
    logging,
    define: defineOptions
  });
}

// Import all models
const User = require('./User')(sequelize);
const LearningClass = require('./LearningClass')(sequelize);
const Lesson = require('./Lesson')(sequelize);
const Progress = require('./Progress')(sequelize);
const Badge = require('./Badge')(sequelize);
const UserBadge = require('./UserBadge')(sequelize);
const UserLearningClass = require('./UserLearningClass')(sequelize);
const ClassLesson = require('./ClassLesson')(sequelize);
const GamifiedContent = require('./GamifiedContent')(sequelize);
const GamifiedProgress = require('./GamifiedProgress')(sequelize);

// Define relationships based on ERD diagram

// User relationships
User.hasMany(LearningClass, { 
  foreignKey: 'teacherId', 
  as: 'taughtClasses' 
});
LearningClass.belongsTo(User, { 
  foreignKey: 'teacherId', 
  as: 'teacher' 
});


// User-Progress relationship
User.hasMany(Progress, { 
  foreignKey: 'userId', 
  as: 'progress' 
});
Progress.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

// Progress-User relationship (for student)
Progress.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'student' 
});

// Teacher-Lesson relationship
User.hasMany(Lesson, { 
  foreignKey: 'teacherId', 
  as: 'lessons' 
});
Lesson.belongsTo(User, { 
  foreignKey: 'teacherId', 
  as: 'teacher' 
});

// Lesson-Progress relationship
Lesson.hasMany(Progress, { 
  foreignKey: 'lessonId', 
  as: 'progress' 
});
Progress.belongsTo(Lesson, { 
  foreignKey: 'lessonId', 
  as: 'lesson' 
});

// User-Badge many-to-many relationship
User.belongsToMany(Badge, { 
  through: UserBadge, 
  foreignKey: 'userId', 
  otherKey: 'badgeId',
  as: 'badges' 
});
Badge.belongsToMany(User, { 
  through: UserBadge, 
  foreignKey: 'badgeId', 
  otherKey: 'userId',
  as: 'users' 
});

// UserBadge relationships
UserBadge.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});
UserBadge.belongsTo(Badge, { 
  foreignKey: 'badgeId', 
  as: 'badge' 
});

// User-LearningClass many-to-many relationship (students)
User.belongsToMany(LearningClass, { 
  through: UserLearningClass, 
  foreignKey: 'userId', 
  otherKey: 'classId',
  as: 'enrolledClasses' 
});
LearningClass.belongsToMany(User, { 
  through: UserLearningClass, 
  foreignKey: 'classId', 
  otherKey: 'userId',
  as: 'enrolledStudents' 
});

// UserLearningClass relationships
UserLearningClass.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});
UserLearningClass.belongsTo(LearningClass, { 
  foreignKey: 'classId', 
  as: 'learningClass' 
});

// LearningClass-Lesson many-to-many relationship
LearningClass.belongsToMany(Lesson, { 
  through: ClassLesson, 
  foreignKey: 'classId', 
  otherKey: 'lessonId',
  as: 'lessons' 
});
Lesson.belongsToMany(LearningClass, { 
  through: ClassLesson, 
  foreignKey: 'lessonId', 
  otherKey: 'classId',
  as: 'classes' 
});

// Gamified progress relationships
User.hasMany(GamifiedProgress, {
  foreignKey: 'userId',
  as: 'gamifiedProgress'
});
GamifiedProgress.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

GamifiedContent.hasMany(GamifiedProgress, {
  foreignKey: 'contentId',
  as: 'progress'
});
GamifiedProgress.belongsTo(GamifiedContent, {
  foreignKey: 'contentId',
  as: 'content'
});

// ClassLesson relationships
ClassLesson.belongsTo(LearningClass, { 
  foreignKey: 'classId', 
  as: 'learningClass' 
});
ClassLesson.belongsTo(Lesson, { 
  foreignKey: 'lessonId', 
  as: 'lesson' 
});

// User model now has totalPoints field defined directly

// Initialize database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (create tables)
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
    
    // Seed initial data
    await seedInitialData();
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Seed initial data
const seedInitialData = async () => {
  try {
    const userCount = await User.count();
    const gamifiedCount = await GamifiedContent.count();
    
    // Always reseed gamified content to ensure we have the latest games
    console.log('Clearing and reseeding gamified content...');
    await GamifiedContent.destroy({ where: {} });
    
    let teacherUser;
    
    // Only create users if they don't exist
    if (userCount === 0) {
      console.log('Creating initial users...');
      
      // Create default admin user
      const adminUser = await User.create({
        fullName: 'Telesphore Uwabera',
        email: 'telesphore91073@gmail.com',
        passwordHash: '91073@Tecy', // Will be hashed by hook
        role: 'admin'
      });

      // Create sample teacher
      teacherUser = await User.create({
        fullName: 'Pierre Nkurunziza',
        email: 'pierre@diglearners.rw',
        passwordHash: 'teacher123',
        role: 'teacher'
      });

      // Create sample student
      const studentUser = await User.create({
        fullName: 'Telesphore Uwabera',
        email: 'telesphore@alustudent.com',
        passwordHash: 'student123',
        role: 'learner'
      });
    } else {
      console.log('Users already exist, skipping user creation...');
      // Find existing teacher for lesson creation
      teacherUser = await User.findOne({ where: { role: 'teacher' } });
    }

    // Skip lesson and class creation if users already exist
    if (userCount === 0 && teacherUser) {
      // Create sample learning class
      const sampleClass = await LearningClass.create({
        name: 'Digital Literacy Class',
        teacherId: teacherUser.id,
        description: 'Introduction to digital literacy for students',
        grade: null
      });

      // Create sample lessons
      const lessons = [
        {
          title: 'Introduction to Typing',
          moduleType: 'typing',
          content: '<h1>Welcome to Typing!</h1><p>Learn the basics of keyboard typing.</p>',
          description: 'Basic typing skills for beginners',
          difficulty: 'beginner',
          ageGroup: '6-8',
          order: 1
        },
        {
          title: 'Safe Internet Browsing',
          moduleType: 'safety',
          content: '<h1>Stay Safe Online</h1><p>Learn how to browse the internet safely.</p>',
          description: 'Internet safety fundamentals',
          difficulty: 'beginner',
          ageGroup: '6-8',
          order: 2
        },
        {
          title: 'Block Coding Basics',
          moduleType: 'coding',
          content: '<h1>Start Coding!</h1><p>Learn programming with visual blocks.</p>',
          description: 'Introduction to programming concepts',
          difficulty: 'beginner',
          ageGroup: '6-8',
          order: 3
        }
      ];

      for (const lessonData of lessons) {
        const lesson = await Lesson.create(lessonData);
        // Assign lesson to class
        if (teacherUser) {
          await ClassLesson.assignLessonToClass(sampleClass.id, lesson.id, teacherUser.id);
        }
      }
    }

    // Create sample badges only if users don't exist
    if (userCount === 0) {
      const badges = [
        {
          name: 'First Step',
          description: 'Completed your first lesson!',
          criteria: 'Complete any lesson',
          icon: '🌟',
          points: 20,
          category: 'achievement',
          requirements: { minLessons: 1 }
        },
        {
          name: 'Typing Master',
          description: 'Achieved 40 WPM in a typing lesson!',
          criteria: 'Reach 40 WPM in typing',
          icon: 'computer',
          points: 50,
          category: 'achievement',
          requirements: { lessonType: 'typing', minScore: 40 }
        },
        {
          name: 'Safe Surfer',
          description: 'Successfully navigated 5 safe browsing scenarios!',
          criteria: 'Complete 5 safety lessons',
          icon: 'shield',
          points: 40,
          category: 'achievement',
          requirements: { lessonType: 'safety', minLessons: 5 }
        },
        {
          name: 'Code Wizard',
          description: 'Solved 10 coding puzzles!',
          criteria: 'Complete 10 coding lessons',
          icon: '🧙',
          points: 60,
          category: 'achievement',
          requirements: { lessonType: 'coding', minLessons: 10 }
        },
        {
          name: '7-Day Streak',
          description: 'Logged in for 7 consecutive days!',
          criteria: '7 consecutive days of activity',
          icon: 'lightning',
          points: 30,
          category: 'milestone',
          requirements: { streakDays: 7 }
        },
        {
          name: 'Perfect Score',
          description: 'Scored 100% on any lesson!',
          criteria: 'Get 100% score on any lesson',
          icon: '💯',
          points: 25,
          category: 'achievement',
          requirements: { minScore: 100 }
        }
      ];

      for (const badgeData of badges) {
        await Badge.create(badgeData);
      }
    }

    // Seed gamified content
    const sampleGamifiedContent = require('../seeders/gamifiedContentData');
    for (const contentData of sampleGamifiedContent) {
      await GamifiedContent.create(contentData);
    }

    console.log('Initial data seeded successfully.');
    console.log(`Seeded ${sampleGamifiedContent.length} gamified content items.`);

  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

module.exports = {
  sequelize,
  User,
  LearningClass,
  Lesson,
  Progress,
  Badge,
  UserBadge,
  UserLearningClass,
  ClassLesson,
  GamifiedContent,
  GamifiedProgress,
  initializeDatabase
};
