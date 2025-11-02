// Learner API - Student dashboard and functionality endpoints
const express = require('express');
const { User, Lesson, Progress, Badge, UserBadge, GamifiedContent, sequelize } = require('../models');
const { authenticateToken, requireLearner } = require('../middleware/auth');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

const router = express.Router();

// Get learner dashboard data
router.get('/dashboard', authenticateToken, requireLearner, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user stats
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's progress data (handle errors gracefully)
    let progressData = [];
    try {
      progressData = await Progress.findAll({
        where: { userId },
        include: [
          {
            model: Lesson,
            as: 'lesson',
            attributes: ['id', 'title', 'pointsReward'],
            required: false
          }
        ]
      });
    } catch (progressError) {
      console.error('Error fetching progress data:', progressError);
      // Continue without progress data
      progressData = [];
    }

    // Calculate stats
    const totalPoints = user.totalPoints || 0;
    const completedLessons = progressData.filter(p => p.isCompleted).length;
    const totalLessons = progressData.length;
    const averageScore = progressData.length > 0 
      ? Math.round(progressData.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.length)
      : 0;

    // Get recent badges (handle errors gracefully)
    let recentBadges = [];
    try {
      const userBadges = await UserBadge.findAll({
        where: { userId },
        include: [
          {
            model: Badge,
            as: 'badge',
            attributes: ['id', 'name', 'description', 'icon', 'points'],
            required: false // Use LEFT JOIN to include UserBadges even if badge is missing
          }
        ],
        order: [['awardedAt', 'DESC']],
        limit: 10
      });
      // Filter out UserBadges where badge is null (orphaned records)
      recentBadges = userBadges.filter(ub => ub.badge && ub.badge.id).slice(0, 3);
    } catch (badgeError) {
      console.error('Error fetching badges:', badgeError);
      // Continue without badges
      recentBadges = [];
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalPoints,
          badgesEarned: recentBadges.length,
          gamesCompleted: completedLessons,
          currentStreak: 0, // TODO: Implement streak calculation
          averageScore,
          totalLessons
        },
        recentBadges: recentBadges.map(ub => ({
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
          points: ub.badge.points,
          earnedAt: ub.awardedAt || ub.earnedAt
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching learner dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching dashboard data'
    });
  }
});

// Get learner achievements and badges
router.get('/achievements', authenticateToken, requireLearner, async (req, res) => {
  console.log('[Learner API] /achievements endpoint called');
  console.log('[Learner API] Request user:', req.user);
  try {
    const userId = req.user?.userId;
    console.log('[Learner API] Fetching achievements for user:', userId);
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    // Get all badges with error handling
    let allBadges = [];
    try {
      allBadges = await Badge.findAll({
        order: [['points', 'DESC']]
      });
      console.log('[Learner API] Found', allBadges.length, 'total badges');
    } catch (badgeError) {
      console.error('[Learner API] Error fetching badges:', badgeError);
      console.error('[Learner API] Badge error stack:', badgeError.stack);
      // Continue with empty array if badges table doesn't exist or has issues
      allBadges = [];
    }

    // Get user's earned badges - filter out any with null badges (orphaned records)
    let earnedBadges = [];
    try {
      earnedBadges = await UserBadge.findAll({
        where: { userId },
        include: [
          {
            model: Badge,
            as: 'badge',
            attributes: ['id', 'name', 'description', 'icon', 'points', 'category', 'criteria'],
            required: false // Use LEFT JOIN to include UserBadges even if badge is missing
          }
        ]
        // Temporarily removed order clause to test
      });
      console.log('[Learner API] Found', earnedBadges.length, 'user badges');
    } catch (userBadgeError) {
      console.error('[Learner API] Error fetching user badges:', userBadgeError);
      console.error('[Learner API] UserBadge error name:', userBadgeError.name);
      console.error('[Learner API] UserBadge error message:', userBadgeError.message);
      console.error('[Learner API] UserBadge error stack:', userBadgeError.stack);
      // Continue with empty array if UserBadge table doesn't exist or has issues
      earnedBadges = [];
    }

    // Filter out UserBadges where badge is null (orphaned records)
    const validEarnedBadges = earnedBadges.filter(eb => eb && eb.badge && eb.badge.id);
    console.log('[Learner API] Found', validEarnedBadges.length, 'valid earned badges');

    // Create earned badges map - only include badges that exist
    const earnedBadgeIds = new Set(validEarnedBadges.map(eb => eb.badge.id));

    // Create a map of earned badges with their earnedAt dates
    const earnedBadgeDates = new Map();
    validEarnedBadges.forEach(eb => {
      if (eb && eb.badge && eb.badge.id) {
        earnedBadgeDates.set(eb.badge.id, eb.awardedAt || eb.earnedAt);
      }
    });

    // Separate earned and available badges - handle empty arrays
    const badges = Array.isArray(allBadges) ? allBadges.map(badge => ({
      id: badge.id,
      name: badge.name || 'Unnamed Badge',
      description: badge.description || '',
      icon: badge.icon || '🏆',
      points: badge.points || 0,
      category: badge.category || 'achievement',
      criteria: badge.criteria || '',
      isEarned: earnedBadgeIds.has(badge.id),
      earnedAt: earnedBadgeDates.get(badge.id) || null
    })) : [];

    const earned = badges.filter(b => b.isEarned);

    console.log('[Learner API] Returning', badges.length, 'total badges,', earned.length, 'earned');

    res.json({
      success: true,
      data: {
        badges: badges, // All badges with isEarned status
        achievements: earned.map(badge => ({
          id: badge.id,
          name: badge.name,
          title: badge.name, // Alias for compatibility
          description: badge.description,
          icon: badge.icon,
          points: badge.points,
          category: badge.category,
          earnedAt: badge.earnedAt
        }))
      },
      // Also include at root level for compatibility
      badges: badges,
      achievements: earned.map(badge => ({
        id: badge.id,
        name: badge.name,
        title: badge.name,
        description: badge.description,
        icon: badge.icon,
        points: badge.points,
        category: badge.category,
        earnedAt: badge.earnedAt
      }))
    });

  } catch (error) {
    console.error('[Learner API] Error fetching learner achievements:', error);
    console.error('[Learner API] Error name:', error.name);
    console.error('[Learner API] Error message:', error.message);
    console.error('[Learner API] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching achievements',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get learner's gamified content based on grade
router.get('/my-content', authenticateToken, requireLearner, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's grade
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get content based on user's grade
    let whereClause = { isActive: true };
    
    if (user.grade) {
      // Normalize grade format - try both "4" and "Grade 4"
      const gradesToTry = [];
      if (user.grade.startsWith('Grade ')) {
        gradesToTry.push(user.grade);
        gradesToTry.push(user.grade.replace('Grade ', '').trim());
      } else {
        gradesToTry.push(user.grade);
        gradesToTry.push(`Grade ${user.grade}`);
      }
      
      // Use Op.in to search for content with any of these grade formats
      whereClause.grade = { [Op.in]: gradesToTry };
    } else if (user.age) {
      // Map age to grade if grade is not set
      const ageToGrade = {
        6: 'Grade 1', 7: 'Grade 2', 8: 'Grade 3', 9: 'Grade 4',
        10: 'Grade 5', 11: 'Grade 6', 12: 'Grade 7', 13: 'Grade 8',
        14: 'Grade 9', 15: 'Grade 10', 16: 'Grade 11', 17: 'Grade 12'
      };
      const mappedGrade = ageToGrade[user.age];
      if (mappedGrade) {
        whereClause.grade = { [Op.in]: [mappedGrade, mappedGrade.replace('Grade ', '').trim()] };
      }
    }

    const content = await GamifiedContent.findAll({
      where: whereClause,
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
      limit: 20
    });

    res.json({
      success: true,
      data: content.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        gameType: item.gameType,
        difficulty: item.difficulty,
        pointsReward: item.pointsReward,
        estimatedTime: item.estimatedTime,
        grade: item.grade,
        ageGroup: item.ageGroup,
        content: item.content,
        instructions: item.instructions,
        learningObjectives: item.learningObjectives
      }))
    });

  } catch (error) {
    console.error('Error fetching learner content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching content'
    });
  }
});

// Update learner progress
router.post('/progress', authenticateToken, requireLearner, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lessonId, score, timeSpent, isCompleted } = req.body;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        error: 'Lesson ID is required'
      });
    }

    // Find or create progress record
    let progress = await Progress.findOne({
      where: { userId, lessonId }
    });

    if (progress) {
      // Update existing progress
      await progress.update({
        score: score || progress.score,
        timeSpent: timeSpent || progress.timeSpent,
        isCompleted: isCompleted !== undefined ? isCompleted : progress.isCompleted,
        completionDate: isCompleted ? new Date() : progress.completionDate
      });
    } else {
      // Create new progress record
      progress = await Progress.create({
        userId,
        lessonId,
        score: score || 0,
        timeSpent: timeSpent || 0,
        isCompleted: isCompleted || false,
        completionDate: isCompleted ? new Date() : null
      });
    }

    // Update user's total points if lesson is completed
    if (isCompleted && score) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({
          totalPoints: (user.totalPoints || 0) + (score * 10) // 10 points per score point
        });
      }
      
      // Check for badge eligibility and award badges when lesson is completed
      try {
        const eligibleBadges = await progress.calculateBadgeEligibility();
        const newBadges = [];
        
        for (const badge of eligibleBadges) {
          try {
            const userBadge = await badge.awardBadge(userId);
            // Include badge details in response
            const badgeData = await Badge.findByPk(badge.id);
            newBadges.push({
              id: userBadge.id,
              badgeId: badge.id,
              name: badgeData.name,
              description: badgeData.description,
              icon: badgeData.icon,
              points: badgeData.points,
              category: badgeData.category,
              awardedAt: userBadge.awardedAt
            });
          } catch (error) {
            console.log(`Badge ${badge.name} already awarded or error:`, error.message);
          }
        }
        
        if (newBadges.length > 0) {
          return res.json({
            success: true,
            message: 'Progress updated successfully. Badges awarded!',
            data: progress,
            newBadges: newBadges
          });
        }
      } catch (badgeError) {
        console.error('Error checking badges:', badgeError);
        // Continue even if badge checking fails
      }
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });

  } catch (error) {
    console.error('Error updating learner progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error updating progress'
    });
  }
});

// Get learner's lesson progress
router.get('/progress', authenticateToken, requireLearner, async (req, res) => {
  try {
    const userId = req.user.userId;

    const progress = await Progress.findAll({
      where: { userId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'moduleType', 'difficulty', 'estimatedDuration']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: progress.map(p => ({
        id: p.id,
        lessonId: p.lessonId,
        lesson: p.lesson,
        score: p.score,
        timeSpent: p.timeSpent,
        isCompleted: p.isCompleted,
        completionDate: p.completionDate,
        progressPercentage: p.progressPercentage,
        lastAccessedAt: p.lastAccessedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching learner progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching progress'
    });
  }
});

module.exports = router;
