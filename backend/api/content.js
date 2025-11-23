// Content Management API - Based on Use Case Diagram
const express = require('express');
const { Lesson, LearningClass, ClassLesson } = require('../models');
const { authenticateToken, requireAdmin, requireTeacher } = require('../middleware/auth');

const router = express.Router();

// Get all lessons (public)
router.get('/lessons', async (req, res) => {
  try {
    const { moduleType, difficulty, ageGroup, page = 1, limit = 10 } = req.query;
    
    const whereClause = { isActive: true };
    
    if (moduleType) whereClause.moduleType = moduleType;
    if (difficulty) whereClause.difficulty = difficulty;
    if (ageGroup) whereClause.ageGroup = ageGroup;

    const offset = (page - 1) * limit;

    const lessons = await Lesson.findAndCountAll({
      where: whereClause,
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      lessons: lessons.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: lessons.count,
        pages: Math.ceil(lessons.count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching lessons'
    });
  }
});

// Get lesson by ID
router.get('/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      lesson: lesson.getLessonContent()
    });

  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching lesson'
    });
  }
});

// Create new lesson (Admin only)
router.post('/lessons', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      moduleType,
      content,
      description,
      difficulty = 'beginner',
      estimatedDuration,
      ageGroup,
      order = 0
    } = req.body;

    // Validate required fields
    if (!title || !moduleType || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title, module type, and content are required'
      });
    }

    const lesson = await Lesson.create({
      title,
      moduleType,
      content,
      description,
      difficulty,
      estimatedDuration,
      ageGroup,
      order
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      lesson: lesson.getLessonContent()
    });

  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error creating lesson'
    });
  }
});

// Update lesson (Admin only)
router.put('/lessons/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    const updateData = req.body;
    await lesson.updateLesson(updateData);

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      lesson: lesson.getLessonContent()
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error updating lesson'
    });
  }
});

// Delete lesson (Admin only)
router.delete('/lessons/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Soft delete by setting isActive to false
    await lesson.update({ isActive: false });

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error deleting lesson'
    });
  }
});

// Get learning classes
router.get('/classes', async (req, res) => {
  try {
    const { teacherId, isActive = true } = req.query;
    
    const whereClause = {};
    if (teacherId) whereClause.teacherId = teacherId;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    const classes = await LearningClass.findAll({
      where: whereClause,
      include: ['teacher'],
      order: [['createdAt', 'DESC']]
    });

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

// Get class by ID
router.get('/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const learningClass = await LearningClass.findByPk(id, {
      include: ['teacher', 'lessons']
    });

    if (!learningClass) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.json({
      success: true,
      class: learningClass
    });

  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching class'
    });
  }
});

// Create learning class (Teacher/Admin only)
router.post('/classes', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { name, description, grade } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Class name is required'
      });
    }

    const learningClass = await LearningClass.create({
      name,
      description,
      grade,
      teacherId: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      class: learningClass
    });

  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error creating class'
    });
  }
});

// Assign lesson to class (Teacher/Admin only)
router.post('/classes/:classId/lessons/:lessonId', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { classId, lessonId } = req.params;
    const { dueDate, isRequired = true, order = 0 } = req.body;

    // Check if class exists and user has permission
    const learningClass = await LearningClass.findByPk(classId);
    if (!learningClass) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    // Check if user is teacher of this class or admin
    if (learningClass.teacherId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to assign lessons to this class'
      });
    }

    // Check if lesson exists
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    const classLesson = await ClassLesson.assignLessonToClass(
      classId,
      lessonId,
      req.user.userId,
      { dueDate, isRequired, order }
    );

    res.status(201).json({
      success: true,
      message: 'Lesson assigned to class successfully',
      classLesson
    });

  } catch (error) {
    console.error('Error assigning lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error assigning lesson'
    });
  }
});

// Get lessons for a specific class
router.get('/classes/:id/lessons', async (req, res) => {
  try {
    const { id } = req.params;
    const lessons = await ClassLesson.findLessonsForClass(id);

    res.json({
      success: true,
      lessons
    });

  } catch (error) {
    console.error('Error fetching class lessons:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching class lessons'
    });
  }
});

// Get lesson statistics
router.get('/lessons/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    const progress = await lesson.getProgress();
    
    const stats = {
      totalAttempts: progress.length,
      completedAttempts: progress.filter(p => p.isCompleted).length,
      averageScore: progress.length > 0 
        ? progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length 
        : 0,
      averageTimeSpent: progress.length > 0
        ? progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / progress.length
        : 0
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching lesson stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching lesson stats'
    });
  }
});

module.exports = router;
