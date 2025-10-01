// Learning Activities API - Based on Use Case Diagram
const express = require('express');
const { Lesson, Progress, Badge, UserBadge, LearningClass, UserLearningClass } = require('../models');
const { authenticateToken, requireLearner, requireParent } = require('../middleware/auth');

const router = express.Router();

// Get available lessons for learner
router.get('/lessons', authenticateToken, requireLearner, async (req, res) => {
  try {
    const { moduleType, difficulty, ageGroup } = req.query;
    
    const whereClause = { isActive: true };
    if (moduleType) whereClause.moduleType = moduleType;
    if (difficulty) whereClause.difficulty = difficulty;
    if (ageGroup) whereClause.ageGroup = ageGroup;

    const lessons = await Lesson.findAll({
      where: whereClause,
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });

    // Get user's progress for these lessons
    const progress = await Progress.findAll({
      where: { userId: req.user.userId }
    });

    const progressMap = progress.reduce((map, p) => {
      map[p.lessonId] = p;
      return map;
    }, {});

    // Combine lessons with progress
    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson.getLessonContent(),
      progress: progressMap[lesson.id] || null,
      isCompleted: progressMap[lesson.id]?.isCompleted || false,
      userScore: progressMap[lesson.id]?.score || null
    }));

    res.json({
      success: true,
      lessons: lessonsWithProgress
    });

  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching lessons'
    });
  }
});

// Get lesson content for learning
router.get('/lessons/:id', authenticateToken, requireLearner, async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Get user's progress for this lesson
    const progress = await Progress.findOne({
      where: { userId: req.user.userId, lessonId: id }
    });

    res.json({
      success: true,
      lesson: lesson.getLessonContent(),
      progress: progress ? progress.getPerformanceMetrics() : null
    });

  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching lesson'
    });
  }
});

// Start or update lesson progress
router.post('/lessons/:id/progress', authenticateToken, requireLearner, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, timeSpent, progressPercentage, isCompleted = false } = req.body;

    // Validate lesson exists
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Find or create progress record
    let progress = await Progress.findOne({
      where: { userId: req.user.userId, lessonId: id }
    });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user.userId,
        lessonId: id,
        score: score || 0,
        timeSpent: timeSpent || 0,
        progressPercentage: progressPercentage || 0,
        isCompleted: isCompleted || false
      });
    } else {
      // Update existing progress
      await progress.recordProgress({
        score,
        timeSpent,
        progressPercentage,
        isCompleted
      });
    }

    // Check for badge eligibility if lesson is completed
    if (isCompleted) {
      const eligibleBadges = await progress.calculateBadgeEligibility();
      
      // Award eligible badges
      const newBadges = [];
      for (const badge of eligibleBadges) {
        try {
          const userBadge = await badge.awardBadge(req.user.userId);
          newBadges.push(userBadge);
        } catch (error) {
          console.log(`Badge ${badge.name} already awarded or error:`, error.message);
        }
      }

      return res.json({
        success: true,
        message: 'Progress recorded successfully',
        progress: progress.getPerformanceMetrics(),
        newBadges: newBadges.map(badge => badge.displayBadge())
      });
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: progress.getPerformanceMetrics()
    });

  } catch (error) {
    console.error('Error recording progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error recording progress'
    });
  }
});

// Get user's progress summary
router.get('/progress', authenticateToken, requireLearner, async (req, res) => {
  try {
    const summary = await Progress.getUserProgressSummary(req.user.userId);
    
    // Get user's badges
    const badges = await UserBadge.findByUser(req.user.userId);
    
    // Get recent progress
    const recentProgress = await Progress.findByUser(req.user.userId);
    const recentLessons = recentProgress.slice(0, 5).map(p => ({
      lesson: p.lesson,
      progress: p.getPerformanceMetrics()
    }));

    res.json({
      success: true,
      summary: {
        ...summary,
        totalBadges: badges.length,
        recentLessons
      }
    });

  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching progress'
    });
  }
});

// Get user's badges
router.get('/badges', authenticateToken, requireLearner, async (req, res) => {
  try {
    const badges = await UserBadge.findByUser(req.user.userId);
    
    res.json({
      success: true,
      badges: badges.map(badge => badge.displayBadge())
    });

  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching badges'
    });
  }
});

// Get available badges
router.get('/badges/available', authenticateToken, requireLearner, async (req, res) => {
  try {
    const badges = await Badge.getActiveBadges();
    
    // Check which badges the user is eligible for
    const eligibleBadges = [];
    for (const badge of badges) {
      const isEligible = await badge.checkEligibility(req.user.userId);
      if (isEligible) {
        eligibleBadges.push(badge);
      }
    }

    res.json({
      success: true,
      badges: badges.map(badge => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        criteria: badge.criteria,
        icon: badge.icon,
        points: badge.points,
        category: badge.category,
        isEligible: eligibleBadges.some(eb => eb.id === badge.id)
      }))
    });

  } catch (error) {
    console.error('Error fetching available badges:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching available badges'
    });
  }
});

// Get gamified activities (leaderboard, achievements, etc.)
router.get('/activities', authenticateToken, requireLearner, async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    let activities = [];

    if (type === 'all' || type === 'leaderboard') {
      // Get leaderboard data
      const leaderboard = await Progress.findAll({
        include: ['user'],
        order: [['score', 'DESC']],
        limit: 10
      });

      activities.push({
        type: 'leaderboard',
        data: leaderboard.map((progress, index) => ({
          rank: index + 1,
          user: progress.user,
          score: progress.score,
          lesson: progress.lesson
        }))
      });
    }

    if (type === 'all' || type === 'achievements') {
      // Get user's recent achievements
      const recentBadges = await UserBadge.findByUser(req.user.userId);
      const recentAchievements = recentBadges.slice(0, 5);

      activities.push({
        type: 'achievements',
        data: recentAchievements.map(badge => badge.displayBadge())
      });
    }

    if (type === 'all' || type === 'progress') {
      // Get progress summary
      const summary = await Progress.getUserProgressSummary(req.user.userId);
      
      activities.push({
        type: 'progress',
        data: summary
      });
    }

    res.json({
      success: true,
      activities
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching activities'
    });
  }
});

// Get classes for learner
router.get('/classes', authenticateToken, requireLearner, async (req, res) => {
  try {
    const classes = await UserLearningClass.findClassesForUser(req.user.userId);
    
    res.json({
      success: true,
      classes
    });

  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching classes'
    });
  }
});

// Join a class
router.post('/classes/:classId/join', authenticateToken, requireLearner, async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Check if class exists
    const learningClass = await LearningClass.findByPk(classId);
    if (!learningClass) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    // Check if user is already in the class
    const existingMembership = await UserLearningClass.findOne({
      where: { userId: req.user.userId, classId }
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        error: 'User is already in this class'
      });
    }

    // Add user to class
    await UserLearningClass.addUserToClass(req.user.userId, classId);

    res.json({
      success: true,
      message: 'Successfully joined class'
    });

  } catch (error) {
    console.error('Error joining class:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error joining class'
    });
  }
});

// Get child's progress (for parents)
router.get('/children/:childId/progress', authenticateToken, requireParent, async (req, res) => {
  try {
    const { childId } = req.params;
    
    // In a real implementation, you'd verify the parent-child relationship
    const summary = await Progress.getUserProgressSummary(childId);
    const badges = await UserBadge.findByUser(childId);
    const recentProgress = await Progress.findByUser(childId);

    res.json({
      success: true,
      childProgress: {
        summary,
        badges: badges.map(badge => badge.displayBadge()),
        recentLessons: recentProgress.slice(0, 10).map(p => ({
          lesson: p.lesson,
          progress: p.getPerformanceMetrics()
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching child progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching child progress'
    });
  }
});

module.exports = router;
