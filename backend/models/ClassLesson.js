// ClassLesson Model - Junction table for LearningClass-Lesson many-to-many relationship
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClassLesson = sequelize.define('ClassLesson', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'class_id',
      references: {
        model: 'learning_classes',
        key: 'id'
      }
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'lesson_id',
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'assigned_at'
    },
    assignedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'assigned_by',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_required'
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
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
    tableName: 'class_lessons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['class_id', 'lesson_id']
      },
      {
        fields: ['class_id']
      },
      {
        fields: ['lesson_id']
      }
    ]
  });

  // Class methods
  ClassLesson.assignLessonToClass = async function(classId, lessonId, assignedBy = null, options = {}) {
    const { dueDate, isRequired = true, order = 0 } = options;
    
    return await this.create({
      classId,
      lessonId,
      assignedBy,
      dueDate,
      isRequired,
      order,
      assignedAt: new Date()
    });
  };

  ClassLesson.removeLessonFromClass = async function(classId, lessonId) {
    return await this.destroy({
      where: { classId, lessonId }
    });
  };

  ClassLesson.findLessonsForClass = async function(classId) {
    return await this.findAll({
      where: { classId, isActive: true },
      include: ['lesson'],
      order: [['order', 'ASC'], ['assignedAt', 'ASC']]
    });
  };

  ClassLesson.findClassesForLesson = async function(lessonId) {
    return await this.findAll({
      where: { lessonId, isActive: true },
      include: ['learningClass']
    });
  };

  ClassLesson.getUpcomingLessons = async function(classId, limit = 5) {
    const now = new Date();
    return await this.findAll({
      where: {
        classId,
        isActive: true,
        dueDate: {
          [require('sequelize').Op.gte]: now
        }
      },
      include: ['lesson'],
      order: [['dueDate', 'ASC']],
      limit
    });
  };

  ClassLesson.getOverdueLessons = async function(classId) {
    const now = new Date();
    return await this.findAll({
      where: {
        classId,
        isActive: true,
        dueDate: {
          [require('sequelize').Op.lt]: now
        }
      },
      include: ['lesson'],
      order: [['dueDate', 'ASC']]
    });
  };

  return ClassLesson;
};
