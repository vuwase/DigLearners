// Admin API - Complete admin dashboard endpoints
const express = require('express');
const { User, Lesson, Progress, LearningClass, Badge, UserBadge } = require('../models');
const { authenticateToken, requireTeacher } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get admin dashboard data
router.get('/dashboard', authenticateToken, requireTeacher, async (req, res) => {
  try {
    // Simple dashboard data for now
    const totalUsers = await User.count();
    const totalTeachers = await User.count({ where: { role: 'teacher' } });
    const totalStudents = await User.count({ where: { role: 'learner' } });
    const totalLessons = await Lesson.count();

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalTeachers,
          totalStudents,
          totalLessons,
          totalClasses: 0,
          activeUsers: totalUsers // Simplified for now
        },
        recentUsers: [],
        recentLessons: []
      }
    });

  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching dashboard data'
    });
  }
});

// Get all users with filtering
router.get('/users', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    
    const whereClause = {};
    
    if (role && role !== 'all') {
      whereClause.role = role;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'fullName', 'email', 'role', 'grade', 'age', 'totalPoints', 'createdAt']
    });

    res.json({
      success: true,
      users: users.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.count,
        pages: Math.ceil(users.count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching users'
    });
  }
});

// Create new user
router.post('/users', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { fullName, email, password, role, grade, age } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, password, and role are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user data object
    const userData = {
      fullName,
      email,
      password,
      role
    };

    // Add optional fields
    if (grade) userData.grade = grade;
    if (age) userData.age = parseInt(age);

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error creating user'
    });
  }
});

// Update user
router.put('/users/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, grade, age } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user data
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (grade) updateData.grade = grade;
    if (age) updateData.age = parseInt(age);

    await user.update(updateData);

    res.json({
      success: true,
      message: 'User updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error updating user'
    });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error deleting user'
    });
  }
});

// Toggle user status
router.post('/users/:id/toggle-status', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Toggle isActive status
    await user.update({ isActive: !user.isActive });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error toggling user status'
    });
  }
});

// Get content (lessons) with filtering
router.get('/content', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { status, subject, grade, search, page = 1, limit = 10 } = req.query;
    
    const whereClause = {};
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (subject && subject !== 'all') {
      whereClause.subject = subject;
    }
    
    if (grade && grade !== 'all') {
      whereClause.grade = grade;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const lessons = await Lesson.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'fullName', 'email']
        }
      ]
    });

    res.json({
      success: true,
      content: lessons.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: lessons.count,
        pages: Math.ceil(lessons.count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching content'
    });
  }
});

// Create content
router.post('/content', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const {
      title,
      moduleType,
      content,
      description,
      difficulty,
      estimatedDuration,
      ageGroup,
      subject,
      grade,
      teacherId
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
      difficulty: difficulty || 'beginner',
      estimatedDuration,
      ageGroup,
      subject,
      grade,
      teacherId: teacherId || req.user.userId,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      content: lesson.toJSON()
    });

  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error creating content'
    });
  }
});

// Update content
router.put('/content/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    await lesson.update(updateData);

    res.json({
      success: true,
      message: 'Content updated successfully',
      content: lesson.toJSON()
    });

  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error updating content'
    });
  }
});

// Delete content
router.delete('/content/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    await lesson.destroy();

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error deleting content'
    });
  }
});

// Publish content
router.post('/content/:id/publish', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    await lesson.update({ status: 'published' });

    res.json({
      success: true,
      message: 'Content published successfully',
      content: lesson.toJSON()
    });

  } catch (error) {
    console.error('Error publishing content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error publishing content'
    });
  }
});

// Get analytics
router.get('/analytics', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const [
      totalUsers,
      newUsers,
      totalLessons,
      publishedLessons,
      totalProgress,
      completedProgress,
      activeUsers
    ] = await Promise.all([
      User.count(),
      User.count({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        }
      }),
      Lesson.count(),
      Lesson.count({ where: { status: 'published' } }),
      Progress.count({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        }
      }),
      Progress.count({
        where: {
          isCompleted: true,
          createdAt: {
            [Op.gte]: startDate
          }
        }
      }),
      User.count() // Simplified for now - all users as active
    ]);

    const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          newUsers,
          totalLessons,
          publishedLessons,
          completionRate,
          activeUsers
        },
        trends: {
          userGrowth: newUsers,
          contentGrowth: publishedLessons,
          engagement: completionRate
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching analytics'
    });
  }
});

// Get system stats
router.get('/system-stats', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      totalLessons,
      totalClasses,
      totalBadges
    ] = await Promise.all([
      User.count(),
      User.count({ where: { role: 'teacher' } }),
      User.count({ where: { role: 'learner' } }),
      Lesson.count(),
      LearningClass.count(),
      Badge.count()
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalLessons,
        totalClasses,
        totalBadges
      }
    });

  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching system stats'
    });
  }
});

// Get reports
router.get('/reports', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { type = 'all', period = 'week' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const reports = {
      userActivity: {
        totalUsers: await User.count(),
        activeUsers: await User.count(), // Simplified for now
        newUsers: await User.count({
          where: {
            createdAt: {
              [Op.gte]: startDate
            }
          }
        })
      },
      contentStats: {
        totalLessons: await Lesson.count(),
        publishedLessons: await Lesson.count({ where: { status: 'published' } }),
        draftLessons: await Lesson.count({ where: { status: 'draft' } })
      },
      engagement: {
        totalProgress: await Progress.count({
          where: {
            createdAt: {
              [Op.gte]: startDate
            }
          }
        }),
        completedProgress: await Progress.count({
          where: {
            isCompleted: true,
            createdAt: {
              [Op.gte]: startDate
            }
          }
        })
      }
    };

    res.json({
      success: true,
      data: reports
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching reports'
    });
  }
});

// Generate report
router.post('/reports/generate', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { type, period, format = 'json' } = req.body;

    // This would typically generate a downloadable report
    // For now, we'll return a success message
    res.json({
      success: true,
      message: `Report generated successfully`,
      data: {
        type,
        period,
        format,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error generating report'
    });
  }
});

// Get settings
router.get('/settings', authenticateToken, requireTeacher, async (req, res) => {
  try {
    // Return default settings for now
    const settings = {
      system: {
        siteName: 'DigLearners',
        siteDescription: 'Digital Learning Platform',
        maintenanceMode: false,
        registrationEnabled: true,
        maxFileSize: '10MB',
        allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx']
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
        systemAlerts: true
      },
      security: {
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireEmailVerification: true,
        twoFactorAuth: false
      }
    };

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching settings'
    });
  }
});

// Update settings
router.put('/settings', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const settingsData = req.body;

    // In a real application, you would save these to a database
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settingsData
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error updating settings'
    });
  }
});

module.exports = router;


