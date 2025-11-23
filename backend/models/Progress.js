// Progress Model - Based on ERD Diagram
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Progress = sequelize.define('Progress', {
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
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'lesson_id',
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completion_date'
    },
    timeSpent: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: true,
      field: 'time_spent'
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
    tableName: 'progress',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'lesson_id']
      }
    ]
  });

  // Instance methods
  Progress.prototype.recordProgress = async function(progressData) {
    const updateData = {
      ...progressData,
      lastAccessedAt: new Date()
    };

    if (progressData.score !== undefined) {
      updateData.score = progressData.score;
    }

    if (progressData.progressPercentage >= 100) {
      updateData.isCompleted = true;
      updateData.completionDate = new Date();
    }

    return await this.update(updateData);
  };

  Progress.prototype.calculateBadgeEligibility = async function() {
    const { Badge } = require('./Badge');
    const badges = await Badge.findAll();
    const eligibleBadges = [];

    for (const badge of badges) {
      const isEligible = await badge.checkEligibility(this.userId);
      if (isEligible) {
        eligibleBadges.push(badge);
      }
    }

    return eligibleBadges;
  };

  Progress.prototype.getPerformanceMetrics = function() {
    return {
      score: this.score,
      completionDate: this.completionDate,
      timeSpent: this.timeSpent,
      attempts: this.attempts,
      isCompleted: this.isCompleted,
      progressPercentage: this.progressPercentage,
      lastAccessedAt: this.lastAccessedAt
    };
  };

  // Class methods
  Progress.findByUser = async function(userId) {
    return await this.findAll({ 
      where: { userId },
      include: ['lesson'],
      order: [['updatedAt', 'DESC']]
    });
  };

  Progress.findByLesson = async function(lessonId) {
    return await this.findAll({ 
      where: { lessonId },
      include: ['user']
    });
  };

  Progress.findCompletedByUser = async function(userId) {
    return await this.findAll({ 
      where: { 
        userId,
        isCompleted: true 
      },
      include: ['lesson'],
      order: [['completionDate', 'DESC']]
    });
  };

  Progress.getUserProgressSummary = async function(userId) {
    const progress = await this.findAll({ 
      where: { userId },
      include: ['lesson']
    });

    const totalLessons = progress.length;
    const completedLessons = progress.filter(p => p.isCompleted).length;
    const averageScore = progress.reduce((sum, p) => sum + (p.score || 0), 0) / totalLessons;
    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

    return {
      totalLessons,
      completedLessons,
      completionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      averageScore: averageScore || 0,
      totalTimeSpent,
      lastAccessedAt: progress.length > 0 ? progress[0].lastAccessedAt : null
    };
  };

  return Progress;
};
