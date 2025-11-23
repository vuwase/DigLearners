// UserBadge Model - Junction table for User-Badge many-to-many relationship
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserBadge = sequelize.define('UserBadge', {
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
    badgeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'badge_id',
      references: {
        model: 'badges',
        key: 'id'
      }
    },
    awardedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'awarded_at'
    },
    awardedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'awarded_by',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_visible'
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
    tableName: 'user_badges',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'badge_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['badge_id']
      },
      {
        fields: ['awarded_at']
      }
    ]
  });

  // Instance methods
  UserBadge.prototype.displayBadge = function() {
    return {
      id: this.id,
      userId: this.userId,
      badgeId: this.badgeId,
      awardedAt: this.awardedAt,
      awardedBy: this.awardedBy,
      isVisible: this.isVisible,
      badge: this.badge ? {
        id: this.badge.id,
        name: this.badge.name,
        description: this.badge.description,
        icon: this.badge.icon,
        points: this.badge.points,
        category: this.badge.category
      } : null
    };
  };

  UserBadge.prototype.hide = async function() {
    return await this.update({ isVisible: false });
  };

  UserBadge.prototype.show = async function() {
    return await this.update({ isVisible: true });
  };

  // Class methods
  UserBadge.findByUser = async function(userId, includeHidden = false) {
    const whereClause = { userId };
    if (!includeHidden) {
      whereClause.isVisible = true;
    }

    return await this.findAll({ 
      where: whereClause,
      include: ['badge'],
      order: [['awardedAt', 'DESC']]
    });
  };

  UserBadge.findByBadge = async function(badgeId) {
    return await this.findAll({ 
      where: { badgeId },
      include: ['user'],
      order: [['awardedAt', 'DESC']]
    });
  };

  UserBadge.findRecent = async function(limit = 10) {
    return await this.findAll({
      include: ['user', 'badge'],
      order: [['awardedAt', 'DESC']],
      limit
    });
  };

  UserBadge.getUserBadgeStats = async function(userId) {
    const badges = await this.findAll({ 
      where: { userId, isVisible: true },
      include: ['badge']
    });

    const totalBadges = badges.length;
    const totalPoints = badges.reduce((sum, badge) => sum + (badge.badge?.points || 0), 0);
    
    const categoryStats = badges.reduce((stats, userBadge) => {
      const category = userBadge.badge?.category || 'unknown';
      stats[category] = (stats[category] || 0) + 1;
      return stats;
    }, {});

    const recentBadges = badges
      .sort((a, b) => new Date(b.awardedAt) - new Date(a.awardedAt))
      .slice(0, 5)
      .map(badge => badge.displayBadge());

    return {
      totalBadges,
      totalPoints,
      categoryStats,
      recentBadges
    };
  };

  UserBadge.checkUserHasBadge = async function(userId, badgeId) {
    const userBadge = await this.findOne({
      where: { userId, badgeId }
    });
    return !!userBadge;
  };

  UserBadge.awardBadgeToUser = async function(userId, badgeId, awardedBy = null) {
    // Check if user already has this badge
    const existingBadge = await this.findOne({
      where: { userId, badgeId }
    });

    if (existingBadge) {
      throw new Error('User already has this badge');
    }

    return await this.create({
      userId,
      badgeId,
      awardedBy,
      awardedAt: new Date()
    });
  };

  return UserBadge;
};
