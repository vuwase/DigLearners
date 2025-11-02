// Gamified Content API - Handles grade-based educational games
const express = require('express');
const { GamifiedContent, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

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

module.exports = router;
