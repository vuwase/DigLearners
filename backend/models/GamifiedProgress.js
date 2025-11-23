// Gamified Progress Model - Tracks learner progress on gamified content
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GamifiedProgress = sequelize.define('GamifiedProgress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'content_id'
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    progressPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      field: 'progress_percentage',
      validate: {
        min: 0,
        max: 100
      }
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'time_spent',
      comment: 'Time spent in seconds'
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_completed'
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completion_date'
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_accessed_at'
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
    tableName: 'gamified_progress',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'content_id']
      }
    ]
  });

  GamifiedProgress.prototype.recordProgress = async function (progressData = {}) {
    const updateData = {
      ...progressData,
      lastAccessedAt: new Date()
    };

    if (progressData.progressPercentage >= 100) {
      updateData.isCompleted = true;
      updateData.completionDate = new Date();
      updateData.progressPercentage = 100;
    }

    if (progressData.score !== undefined) {
      updateData.score = progressData.score;
    }

    if (progressData.timeSpent !== undefined) {
      updateData.timeSpent = progressData.timeSpent;
    }

    return this.update(updateData);
  };

  GamifiedProgress.getUserSummary = async function (userId) {
    const progress = await this.findAll({
      where: { userId },
      include: ['content']
    });

    const completed = progress.filter(p => p.isCompleted).length;
    const total = progress.length;

    return {
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      recent: progress.slice(0, 5)
    };
  };

  return GamifiedProgress;
};

