// Badge Model - Based on ERD Diagram
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Badge = sequelize.define('Badge', {
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
    criteria: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    category: {
      type: DataTypes.ENUM('achievement', 'milestone', 'special', 'weekly', 'monthly'),
      allowNull: false,
      defaultValue: 'achievement'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON object defining specific requirements for earning this badge'
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
    tableName: 'badges',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Instance methods
  Badge.prototype.checkEligibility = async function(userId) {
    const { Progress } = require('./Progress');
    const { UserBadge } = require('./UserBadge');
    
    // Check if user already has this badge
    const existingBadge = await UserBadge.findOne({
      where: { userId, badgeId: this.id }
    });
    
    if (existingBadge) {
      return false; // User already has this badge
    }

    // Check requirements based on badge type
    switch (this.category) {
      case 'achievement':
        return await this.checkAchievementRequirements(userId);
      case 'milestone':
        return await this.checkMilestoneRequirements(userId);
      case 'special':
        return await this.checkSpecialRequirements(userId);
      case 'weekly':
        return await this.checkWeeklyRequirements(userId);
      case 'monthly':
        return await this.checkMonthlyRequirements(userId);
      default:
        return false;
    }
  };

  Badge.prototype.awardBadge = async function(userId) {
    const { UserBadge } = require('./UserBadge');
    const { User } = require('./User');
    
    try {
      // Create user badge record
      const userBadge = await UserBadge.create({
        userId,
        badgeId: this.id,
        awardedAt: new Date()
      });

      // Update user points
      const user = await User.findByPk(userId);
      if (user) {
        await user.increment('totalPoints', { by: this.points });
      }

      return userBadge;
    } catch (error) {
      throw new Error(`Failed to award badge: ${error.message}`);
    }
  };

  Badge.prototype.checkAchievementRequirements = async function(userId) {
    const { Progress } = require('./Progress');
    
    if (!this.requirements) return false;

    const { lessonType, minScore, minLessons } = this.requirements;
    
    let whereClause = { userId, isCompleted: true };
    if (lessonType) {
      whereClause['$lesson.moduleType$'] = lessonType;
    }

    const completedLessons = await Progress.findAll({
      where: whereClause,
      include: ['lesson']
    });

    if (minLessons && completedLessons.length < minLessons) {
      return false;
    }

    if (minScore) {
      const averageScore = completedLessons.reduce((sum, p) => sum + (p.score || 0), 0) / completedLessons.length;
      if (averageScore < minScore) {
        return false;
      }
    }

    return true;
  };

  Badge.prototype.checkMilestoneRequirements = async function(userId) {
    const { Progress } = require('./Progress');
    
    if (!this.requirements) return false;

    const { totalLessons, streakDays } = this.requirements;
    
    if (totalLessons) {
      const completedCount = await Progress.count({
        where: { userId, isCompleted: true }
      });
      if (completedCount < totalLessons) {
        return false;
      }
    }

    if (streakDays) {
      // Check for consecutive days of activity
      const recentProgress = await Progress.findAll({
        where: { userId },
        order: [['lastAccessedAt', 'DESC']],
        limit: streakDays
      });
      
      // Simple streak check - can be enhanced
      if (recentProgress.length < streakDays) {
        return false;
      }
    }

    return true;
  };

  Badge.prototype.checkSpecialRequirements = async function(userId) {
    // Special badges might have custom logic
    // This can be extended based on specific requirements
    return false;
  };

  Badge.prototype.checkWeeklyRequirements = async function(userId) {
    const { Progress } = require('./Progress');
    
    if (!this.requirements) return false;

    const { weeklyLessons, weeklyScore } = this.requirements;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyProgress = await Progress.findAll({
      where: {
        userId,
        isCompleted: true,
        completionDate: {
          [require('sequelize').Op.gte]: oneWeekAgo
        }
      }
    });

    if (weeklyLessons && weeklyProgress.length < weeklyLessons) {
      return false;
    }

    if (weeklyScore) {
      const averageScore = weeklyProgress.reduce((sum, p) => sum + (p.score || 0), 0) / weeklyProgress.length;
      if (averageScore < weeklyScore) {
        return false;
      }
    }

    return true;
  };

  Badge.prototype.checkMonthlyRequirements = async function(userId) {
    const { Progress } = require('./Progress');
    
    if (!this.requirements) return false;

    const { monthlyLessons, monthlyScore } = this.requirements;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const monthlyProgress = await Progress.findAll({
      where: {
        userId,
        isCompleted: true,
        completionDate: {
          [require('sequelize').Op.gte]: oneMonthAgo
        }
      }
    });

    if (monthlyLessons && monthlyProgress.length < monthlyLessons) {
      return false;
    }

    if (monthlyScore) {
      const averageScore = monthlyProgress.reduce((sum, p) => sum + (p.score || 0), 0) / monthlyProgress.length;
      if (averageScore < monthlyScore) {
        return false;
      }
    }

    return true;
  };

  // Class methods
  Badge.findByCategory = async function(category) {
    return await this.findAll({ 
      where: { category, isActive: true },
      order: [['points', 'ASC']]
    });
  };

  Badge.getActiveBadges = async function() {
    return await this.findAll({ 
      where: { isActive: true },
      order: [['category', 'ASC'], ['points', 'ASC']]
    });
  };

  Badge.findEligibleBadges = async function(userId) {
    const badges = await this.getActiveBadges();
    const eligibleBadges = [];

    for (const badge of badges) {
      const isEligible = await badge.checkEligibility(userId);
      if (isEligible) {
        eligibleBadges.push(badge);
      }
    }

    return eligibleBadges;
  };

  return Badge;
};
