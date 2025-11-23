// Gamified Content API - Handles grade-based educational games
const express = require('express');
const { GamifiedContent, User, GamifiedProgress, Badge, UserBadge } = require('../models');
const { authenticateToken, requireLearner } = require('../middleware/auth');
const { notifyTeachersOfStudentActivity } = require('../services/teacherNotificationService');

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Gamified Content API is working'
  });
});

// Get content by age group (for the age selection interface)
router.get('/age-group/:ageGroup', authenticateToken, async (req, res) => {
  try {
    const { ageGroup } = req.params;
    
    // Validate age group
    const validAgeGroups = ['6-7', '7-8', '8-9', '9-10', '10-11', '11-12'];
    if (!validAgeGroups.includes(ageGroup)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid age group. Must be one of: 6-7, 7-8, 8-9, 9-10, 10-11, 11-12'
      });
    }

    const content = await GamifiedContent.findAll({
      where: {
        ageGroup,
        isActive: true
      },
      order: [['difficulty', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Error fetching content by age group:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get content by grade (for learners with specific grades)
router.get('/grade/:grade', authenticateToken, async (req, res) => {
  try {
    const { grade } = req.params;
    
    // Validate grade
    const validGrades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 
                        'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
    if (!validGrades.includes(grade)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid grade. Must be Grade 1-12'
      });
    }

    const content = await GamifiedContent.findAll({
      where: {
        grade,
        isActive: true
      },
      order: [['difficulty', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Error fetching content by grade:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get content for authenticated user's grade
router.get('/my-content', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Fixed: use userId from middleware
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!user.grade) {
      return res.status(400).json({
        success: false,
        error: 'User grade not set. Please contact your teacher.'
      });
    }

    // Normalize grade format - handle both "4" and "Grade 4" formats
    let gradeToSearch = user.grade;
    if (!gradeToSearch.startsWith('Grade ')) {
      gradeToSearch = `Grade ${gradeToSearch}`;
    }

    // Try to find content with the normalized grade format
    let content = await GamifiedContent.findAll({
      where: {
        grade: gradeToSearch,
        isActive: true
      },
      order: [['difficulty', 'ASC'], ['createdAt', 'DESC']]
    });

    // If no content found with "Grade X" format, try with just the number
    if (content.length === 0 && user.grade.startsWith('Grade ')) {
      const numericGrade = user.grade.replace('Grade ', '').trim();
      content = await GamifiedContent.findAll({
        where: {
          grade: numericGrade,
          isActive: true
        },
        order: [['difficulty', 'ASC'], ['createdAt', 'DESC']]
      });
    }

    // Also try with just the numeric grade if stored as "4"
    if (content.length === 0 && !user.grade.startsWith('Grade ')) {
      content = await GamifiedContent.findAll({
        where: {
          grade: user.grade,
          isActive: true
        },
        order: [['difficulty', 'ASC'], ['createdAt', 'DESC']]
      });
    }

    res.json({
      success: true,
      data: content,
      userGrade: user.grade
    });

  } catch (error) {
    console.error('Error fetching user content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get content by subject
router.get('/subject/:subject', authenticateToken, async (req, res) => {
  try {
    const { subject } = req.params;
    const { grade, ageGroup } = req.query;

    let whereClause = {
      subject,
      isActive: true
    };

    if (grade) {
      whereClause.grade = grade;
    }
    if (ageGroup) {
      whereClause.ageGroup = ageGroup;
    }

    const content = await GamifiedContent.findAll({
      where: whereClause,
      order: [['difficulty', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Error fetching content by subject:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all content (for admin/teacher management)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const { grade, ageGroup, subject, gameType } = req.query;

    let whereClause = { isActive: true };

    if (grade) whereClause.grade = grade;
    if (ageGroup) whereClause.ageGroup = ageGroup;
    if (subject) whereClause.subject = subject;
    if (gameType) whereClause.gameType = gameType;

    const content = await GamifiedContent.findAll({
      where: whereClause,
      order: [['grade', 'ASC'], ['difficulty', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Error fetching all content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create new gamified content (admin/teacher only)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.role !== 'admin' && user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'Only admins and teachers can create content'
      });
    }

    const {
      title,
      description,
      grade,
      ageGroup,
      gameType,
      difficulty,
      subject,
      content,
      instructions,
      learningObjectives,
      estimatedTime,
      pointsReward,
      badgeReward,
      thumbnail,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !grade || !ageGroup || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, grade, age group, and subject are required'
      });
    }

    const gamifiedContent = await GamifiedContent.create({
      title,
      description,
      grade,
      ageGroup,
      gameType: gameType || 'interactive',
      difficulty: difficulty || 'beginner',
      subject,
      content,
      instructions,
      learningObjectives,
      estimatedTime,
      pointsReward: pointsReward || 10,
      badgeReward,
      thumbnail,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Gamified content created successfully',
      data: gamifiedContent
    });

  } catch (error) {
    console.error('Error creating gamified content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Record gamified content progress for learners
router.post('/progress', authenticateToken, requireLearner, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      contentId,
      score = 0,
      progressPercentage = 0,
      timeSpent = 0,
      isCompleted = false
    } = req.body;

    if (!contentId) {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required'
      });
    }

    const content = await GamifiedContent.findByPk(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Gamified content not found'
      });
    }

    const completionStatus = isCompleted || progressPercentage >= 100;

    let progress = await GamifiedProgress.findOne({
      where: { userId, contentId }
    });

    if (progress) {
      progress = await progress.recordProgress({
        score,
        timeSpent,
        progressPercentage,
        isCompleted: completionStatus
      });
    } else {
      progress = await GamifiedProgress.create({
        userId,
        contentId,
        score,
        timeSpent,
        progressPercentage: Math.min(progressPercentage, 100),
        isCompleted: completionStatus,
        completionDate: completionStatus ? new Date() : null,
        lastAccessedAt: new Date()
      });
    }

    const updatedProgress = await GamifiedProgress.findByPk(progress.id, {
      include: [
        {
          model: GamifiedContent,
          as: 'content'
        }
      ]
    });

    const newBadges = [];

    if (completionStatus) {
      // Update user total points
      const user = await User.findByPk(userId);
      if (user) {
        await user.increment('totalPoints', {
          by: content.pointsReward || 10
        });
      }

      if (content.badgeReward) {
        const [badge] = await Badge.findOrCreate({
          where: { name: content.badgeReward },
          defaults: {
            description: `Earned by completing ${content.title}`,
            criteria: `Complete the gamified activity "${content.title}"`,
            icon: '🏆',
            points: content.pointsReward || 10,
            category: 'achievement',
            requirements: null
          }
        });

        const existingUserBadge = await UserBadge.findOne({
          where: {
            userId,
            badgeId: badge.id
          }
        });

        if (!existingUserBadge) {
          const awardedBadge = await UserBadge.create({
            userId,
            badgeId: badge.id,
            awardedAt: new Date()
          });

          if (user) {
            await user.increment('totalPoints', { by: badge.points });
          }

          newBadges.push({
            id: awardedBadge.id,
            badgeId: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            points: badge.points,
            category: badge.category,
            awardedAt: awardedBadge.awardedAt
          });
        }
      }

      await notifyTeachersOfStudentActivity({
        studentId: userId,
        activityType: 'game',
        title: content.title,
        score,
        points: content.pointsReward || 10,
        badges: newBadges
      });
    }

    res.json({
      success: true,
      message: 'Progress recorded successfully',
      data: {
        id: updatedProgress.id,
        contentId: updatedProgress.contentId,
        score: updatedProgress.score,
        progressPercentage: updatedProgress.progressPercentage,
        isCompleted: updatedProgress.isCompleted,
        completionDate: updatedProgress.completionDate,
        timeSpent: updatedProgress.timeSpent,
        content: {
          id: updatedProgress.content.id,
          title: updatedProgress.content.title,
          gameType: updatedProgress.content.gameType,
          badgeReward: updatedProgress.content.badgeReward,
          pointsReward: updatedProgress.content.pointsReward
        }
      },
      newBadges
    });
  } catch (error) {
    console.error('Error recording gamified progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error recording progress'
    });
  }
});

module.exports = router;
