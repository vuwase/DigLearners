// Lesson Model - Based on ERD Diagram
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lesson = sequelize.define('Lesson', {
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
        len: [2, 255]
      }
    },
    moduleType: {
      type: DataTypes.ENUM('typing', 'safety', 'coding', 'general'),
      allowNull: false,
      field: 'module_type'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner'
    },
    estimatedDuration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true,
      field: 'estimated_duration'
    },
    ageGroup: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'age_group'
    },
    subject: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'teacher_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft'
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resources: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assignmentType: {
      type: DataTypes.ENUM('lesson', 'puzzle', 'quiz', 'project'),
      allowNull: true,
      field: 'assignment_type',
      defaultValue: 'lesson'
    },
    puzzleType: {
      type: DataTypes.ENUM('drag-drop', 'matching', 'sequencing', 'fill-blank', 'multiple-choice'),
      allowNull: true,
      field: 'puzzle_type'
    },
    questions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
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
    tableName: 'lessons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Instance methods
  Lesson.prototype.getLessonContent = function() {
    return {
      id: this.id,
      title: this.title,
      moduleType: this.moduleType,
      content: this.content,
      description: this.description,
      difficulty: this.difficulty,
      estimatedDuration: this.estimatedDuration,
      ageGroup: this.ageGroup
    };
  };

  Lesson.prototype.updateLesson = async function(updateData) {
    return await this.update(updateData);
  };

  Lesson.prototype.getProgress = async function() {
    const { Progress } = require('./Progress');
    return await Progress.findAll({
      where: { lessonId: this.id },
      include: ['user']
    });
  };

  // Class methods
  Lesson.findByModuleType = async function(moduleType) {
    return await this.findAll({ 
      where: { moduleType, isActive: true },
      order: [['order', 'ASC']]
    });
  };

  Lesson.findByDifficulty = async function(difficulty) {
    return await this.findAll({ 
      where: { difficulty, isActive: true },
      order: [['order', 'ASC']]
    });
  };

  Lesson.findByAgeGroup = async function(ageGroup) {
    return await this.findAll({ 
      where: { ageGroup, isActive: true },
      order: [['order', 'ASC']]
    });
  };

  Lesson.getActiveLessons = async function() {
    return await this.findAll({ 
      where: { isActive: true },
      order: [['order', 'ASC']]
    });
  };

  return Lesson;
};
