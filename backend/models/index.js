// Database Models Index - Sets up all models and relationships
const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../data/diglearners.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Import all models
const User = require('./User')(sequelize);
const LearningClass = require('./LearningClass')(sequelize);
const Lesson = require('./Lesson')(sequelize);
const Progress = require('./Progress')(sequelize);
const Badge = require('./Badge')(sequelize);
const UserBadge = require('./UserBadge')(sequelize);
const UserLearningClass = require('./UserLearningClass')(sequelize);
const ClassLesson = require('./ClassLesson')(sequelize);

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

// User-LearningClass many-to-many relationship
User.belongsToMany(LearningClass, { 
  through: UserLearningClass, 
  foreignKey: 'userId', 
  otherKey: 'classId',
  as: 'classes' 
});
LearningClass.belongsToMany(User, { 
  through: UserLearningClass, 
  foreignKey: 'classId', 
  otherKey: 'userId',
  as: 'users' 
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
    // Check if data already exists
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already has data, skipping seed.');
      return;
    }

    // Create default admin user
    const adminUser = await User.create({
      fullName: 'System Administrator',
      email: 'admin@diglearners.rw',
      passwordHash: 'admin123', // Will be hashed by hook
      role: 'admin'
    });

    // Create sample teacher
    const teacherUser = await User.create({
      fullName: 'Sample Teacher',
      email: 'teacher@diglearners.rw',
      passwordHash: 'teacher123',
      role: 'teacher'
    });

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
      await ClassLesson.assignLessonToClass(sampleClass.id, lesson.id, teacherUser.id);
    }

    // Create sample badges
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

    console.log('Initial data seeded successfully.');

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
  initializeDatabase
};
