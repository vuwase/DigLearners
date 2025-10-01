// UserLearningClass Model - Junction table for User-LearningClass many-to-many relationship
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserLearningClass = sequelize.define('UserLearningClass', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
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
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'joined_at'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    role: {
      type: DataTypes.ENUM('student', 'assistant', 'observer'),
      allowNull: false,
      defaultValue: 'student'
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
    tableName: 'user_learning_classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'class_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['class_id']
      }
    ]
  });

  // Class methods
  UserLearningClass.addUserToClass = async function(userId, classId, role = 'student') {
    return await this.create({
      userId,
      classId,
      role,
      joinedAt: new Date()
    });
  };

  UserLearningClass.removeUserFromClass = async function(userId, classId) {
    return await this.destroy({
      where: { userId, classId }
    });
  };

  UserLearningClass.findUsersInClass = async function(classId) {
    return await this.findAll({
      where: { classId, isActive: true },
      include: ['user']
    });
  };

  UserLearningClass.findClassesForUser = async function(userId) {
    return await this.findAll({
      where: { userId, isActive: true },
      include: ['learningClass']
    });
  };

  return UserLearningClass;
};
