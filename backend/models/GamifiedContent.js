// Gamified Content Model - Stores grade-based educational games and activities
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GamifiedContent = sequelize.define('GamifiedContent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']]
      }
    },
    ageGroup: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['0-2', '3-4', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '7+', 'young', 'elementary', 'middle', 'high']]
      },
      field: 'age_group'
    },
    gameType: {
      type: DataTypes.ENUM('puzzle', 'quiz', 'interactive', 'story', 'simulation', 'creative'),
      allowNull: false,
      defaultValue: 'interactive',
      field: 'game_type'
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner'
    },
    subject: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: [['Digital Literacy', 'Math', 'Science', 'Language', 'Art', 'Music', 'Social Studies']]
      }
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Game content, rules, and interactive elements'
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    learningObjectives: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'learning_objectives'
    },
    estimatedTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Estimated completion time in minutes',
      field: 'estimated_time'
    },
    pointsReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      field: 'points_reward'
    },
    badgeReward: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'badge_reward'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL or path to game thumbnail image'
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of tags for categorization'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'gamified_content',
    timestamps: true,
    underscored: true,
    freezeTableName: true
  });

  return GamifiedContent;
};
