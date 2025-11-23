// LearningClass Model - Based on ERD Diagram
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LearningClass = sequelize.define('LearningClass', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'teacher_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: true
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
    tableName: 'learning_classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Instance methods
  LearningClass.prototype.addLearner = async function(userId) {
    const { UserLearningClass } = require('./UserLearningClass');
    return await UserLearningClass.create({
      classId: this.id,
      userId: userId
    });
  };

  LearningClass.prototype.removeLearner = async function(userId) {
    const { UserLearningClass } = require('./UserLearningClass');
    return await UserLearningClass.destroy({
      where: {
        classId: this.id,
        userId: userId
      }
    });
  };

  LearningClass.prototype.getLearners = async function() {
    const { User } = require('./User');
    return await this.getUsers({
      where: { role: 'learner' },
      through: { attributes: [] }
    });
  };

  LearningClass.prototype.assignLesson = async function(lessonId) {
    const { ClassLesson } = require('./ClassLesson');
    return await ClassLesson.create({
      classId: this.id,
      lessonId: lessonId
    });
  };

  // Class methods
  LearningClass.findByTeacher = async function(teacherId) {
    return await this.findAll({ 
      where: { teacherId },
      include: ['teacher']
    });
  };

  LearningClass.findActiveClasses = async function() {
    return await this.findAll({ 
      where: { isActive: true },
      include: ['teacher']
    });
  };

  return LearningClass;
};
