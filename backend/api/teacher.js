// Teacher API - Real data endpoints for teacher dashboard
const express = require('express');
const { Lesson, LearningClass, Progress, User, ClassLesson } = require('../models');
const { authenticateToken, requireTeacher } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Test analytics endpoint without authentication
router.get('/analytics/test', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        overview: {
          totalStudents: 15,
          activeStudents: 12,
          totalLessons: 8,
          completedLessons: 6,
          averageScore: 85,
          totalAssignments: 10,
          submittedAssignments: 8
        },
        students: [],
        performance: {
          subjectPerformance: [],
          gradeDistribution: [],
          progressTrends: []
        }
      }
    });
  } catch (error) {
    console.error('Error in test analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error in test analytics'
    });
  }
});

// Register a student (teacher creates registration code)
router.post('/register-student', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { fullName, grade, age, school } = req.body;

    // Validate input
    if (!fullName || !grade) {
      return res.status(400).json({
        success: false,
        error: 'Full name and grade are required'
      });
    }

    // Generate unique registration code
    const registrationCode = await User.generateUniqueRegistrationCode();

    // Create student account with registration code (no password needed)
    const student = await User.create({
      fullName,
      role: 'learner',
      grade,
      age: age || null, // Age is optional
      school: school || null, // School is optional but recommended
      registrationCode,
      // No email or password required - student will login with registration code
    });

    res.status(201).json({
      success: true,
      message: `Student registered successfully! Registration code: ${registrationCode}`,
      data: {
        id: student.id,
        fullName: student.fullName,
        grade: student.grade,
        age: student.age,
        school: student.school,
        role: student.role,
        registrationCode: student.registrationCode
      }
    });

  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all students with their registration codes (for teacher management)
router.get('/my-students', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const students = await User.findAll({
      where: { 
        role: 'learner',
        registrationCode: { [Op.not]: null }
      },
      attributes: ['id', 'fullName', 'grade', 'age', 'school', 'registrationCode', 'totalPoints', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Register a child/student (legacy endpoint)
router.post('/register-child', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { fullName, email, password, grade, age } = req.body;

    // Validate input
    if (!fullName || !email || !password || !grade) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, password, and grade are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'A user with this email already exists'
      });
    }

    // Create child account
    const child = await User.create({
      fullName,
      email,
      password: password, // Will be hashed by model hook
      role: 'learner',
      grade,
      age: age || null
    });

    res.status(201).json({
      success: true,
      message: 'Child registered successfully',
      data: {
        id: child.id,
        fullName: child.fullName,
        email: child.email,
        grade: child.grade,
        age: child.age,
        role: child.role
      }
    });

  } catch (error) {
    console.error('Child registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during child registration'
    });
  }
});

// Get all students registered by teacher
router.get('/students', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'learner' },
      attributes: ['id', 'fullName', 'email', 'grade', 'age', 'totalPoints', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update student profile
router.put('/students/:studentId', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { fullName, email, grade, age } = req.body;

    // Validate input
    if (!fullName || !email || !grade) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and grade are required'
      });
    }

    // Find the student
    const student = await User.findOne({
      where: { 
        id: studentId, 
        role: 'learner' 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check if email is already taken by another user
    if (email !== student.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email, 
          id: { [Op.ne]: studentId } 
        } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email is already taken by another user'
        });
      }
    }

    // Update student
    await student.update({
      fullName,
      email,
      grade,
      age: age || null
    });

    res.json({
      success: true,
      message: 'Student profile updated successfully',
      data: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        grade: student.grade,
        age: student.age
      }
    });

  } catch (error) {
    console.error('Student update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during student update'
    });
  }
});

// Get teacher dashboard data
router.get('/dashboard', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;

    // Get real data from database
    const [
      totalStudents,
      totalLessons,
      publishedLessons,
      draftLessons,
      totalAssignments,
      pendingAssignments,
      completedAssignments,
      averageProgress,
      upcomingDeadlines
    ] = await Promise.all([
      // Total students enrolled in teacher's classes
      User.count({
        where: { role: 'learner' },
        include: [
          {
            model: LearningClass,
            as: 'enrolledClasses',
            where: { teacherId },
            required: true
          }
        ]
      }),
      
      // Total lessons created by teacher
      Lesson.count({ where: { teacherId } }),
      
      // Published lessons
      Lesson.count({ where: { teacherId, status: 'published' } }),
      
      // Draft lessons
      Lesson.count({ where: { teacherId, status: 'draft' } }),
      
      // Total assignments (using lessons as assignments)
      Lesson.count({ where: { teacherId } }),
      
      // Pending assignments (lessons with incomplete progress)
      Lesson.count({
        where: { teacherId },
        include: [
          {
            model: Progress,
            as: 'progress',
            where: { isCompleted: false },
            required: true
          }
        ]
      }),
      
      // Completed assignments
      Lesson.count({
        where: { teacherId },
        include: [
          {
            model: Progress,
            as: 'progress',
            where: { isCompleted: true },
            required: true
          }
        ]
      }),
      
      // Average progress calculation
      Progress.findAll({
        where: { isCompleted: true },
        include: [
          {
            model: Lesson,
            as: 'lesson',
            where: { teacherId },
            required: true
          }
        ]
      }).then(progresses => {
        if (progresses.length === 0) return 0;
        const totalScore = progresses.reduce((sum, p) => sum + (p.score || 0), 0);
        return Math.round(totalScore / progresses.length);
      }),
      
      // Upcoming deadlines (lessons with due dates in next 7 days)
      Lesson.count({
        where: {
          teacherId,
          dueDate: {
            [Op.gte]: new Date(),
            [Op.lte]: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Get recent lessons
    const recentLessons = await Lesson.findAll({
      where: { teacherId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get recent activity (progress updates)
    const recentActivity = await Progress.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          where: { teacherId },
          required: true,
          attributes: ['title']
        },
        {
          model: User,
          as: 'student',
          attributes: ['fullName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalLessons,
          totalClasses: 0, // Not implemented yet
          publishedLessons,
          draftLessons,
          averageProgress: await averageProgress,
          totalAssignments,
          pendingAssignments,
          completedAssignments,
          upcomingDeadlines,
          pendingReviews: pendingAssignments // Same as pending assignments for now
        },
        recentLessons,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching dashboard data'
    });
  }
});

// Get teacher's lessons
router.get('/lessons', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { status, subject, grade } = req.query;

    const whereClause = { teacherId };
    if (status && status !== 'all') whereClause.status = status;
    if (subject && subject !== 'all') whereClause.subject = subject;
    if (grade && grade !== 'all') whereClause.grade = grade;

    const lessons = await Lesson.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    // Simplified response without complex associations
    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson.toJSON(),
      studentsCompleted: 0,
      totalStudents: 0,
      averageScore: 0
    }));

    res.json({
      success: true,
      lessons: lessonsWithProgress
    });

  } catch (error) {
    console.error('Error fetching teacher lessons:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching lessons'
    });
  }
});

// Create new lesson
router.post('/lessons', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const {
      title,
      subject,
      grade,
      content,
      description,
      difficulty = 'beginner',
      estimatedDuration,
      objectives = [],
      resources = []
    } = req.body;

    // Validate required fields
    if (!title || !subject || !grade || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title, subject, grade, and content are required'
      });
    }

    const lesson = await Lesson.create({
      title,
      subject,
      grade,
      content,
      description,
      difficulty,
      estimatedDuration,
      objectives: JSON.stringify(objectives),
      resources: JSON.stringify(resources),
      teacherId,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      lesson: lesson.toJSON()
    });

  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error creating lesson'
    });
  }
});

// Update lesson
router.put('/lessons/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const lessonId = req.params.id;
    const updateData = req.body;

    // Check if lesson belongs to teacher
    const lesson = await Lesson.findOne({
      where: { id: lessonId, teacherId }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found or access denied'
      });
    }

    // Update lesson
    await lesson.update(updateData);

    res.json({
      success: true,
      lesson: lesson.toJSON()
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error updating lesson'
    });
  }
});

// Publish lesson
router.post('/lessons/:id/publish', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const lessonId = req.params.id;

    const lesson = await Lesson.findOne({
      where: { id: lessonId, teacherId }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found or access denied'
      });
    }

    await lesson.update({ status: 'published' });

    res.json({
      success: true,
      message: 'Lesson published successfully'
    });

  } catch (error) {
    console.error('Error publishing lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error publishing lesson'
    });
  }
});

// Delete lesson
router.delete('/lessons/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const lessonId = req.params.id;

    const lesson = await Lesson.findOne({
      where: { id: lessonId, teacherId }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found or access denied'
      });
    }

    await lesson.destroy();

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

// Get teacher's students
router.get('/students', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { grade, status } = req.query;

    // Get teacher's classes
    const classes = await LearningClass.findAll({
      where: { teacherId },
      include: [
        {
          model: User,
          as: 'students',
          through: { attributes: [] },
          where: { role: 'learner' }
        }
      ]
    });

    // Flatten students from all classes
    let students = [];
    classes.forEach(cls => {
      students = students.concat(cls.students);
    });

    // Filter by grade if specified
    if (grade && grade !== 'all') {
      students = students.filter(student => student.grade === grade);
    }

    // Get progress data for each student
    const studentsWithProgress = await Promise.all(students.map(async (student) => {
      const progress = await Progress.findAll({
        where: { userId: student.id },
        include: [
          {
            model: Lesson,
            as: 'lesson',
            attributes: ['id', 'title', 'subject']
          }
        ]
      });

      const completedLessons = progress.filter(p => p.isCompleted).length;
      const totalLessons = progress.length;
      const averageScore = progress.length > 0 
        ? Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length)
        : 0;

      return {
        ...student.toJSON(),
        completedLessons,
        totalLessons,
        averageScore,
        lastActive: progress.length > 0 ? progress[0].updatedAt : null
      };
    }));

    res.json({
      success: true,
      students: studentsWithProgress
    });

  } catch (error) {
    console.error('Error fetching teacher students:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching students'
    });
  }
});

// Get assignments
router.get('/assignments', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { status, subject, grade } = req.query;

    const whereClause = { teacherId };
    if (status && status !== 'all') whereClause.status = status;
    if (subject && subject !== 'all') whereClause.subject = subject;
    if (grade && grade !== 'all') whereClause.grade = grade;

    // For now, we'll use lessons as assignments since they serve similar purposes
    const assignments = await Lesson.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    // Get progress data for each assignment
    const assignmentsWithProgress = await Promise.all(assignments.map(async (assignment) => {
      const progress = await Progress.findAll({
        where: { lessonId: assignment.id },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'fullName']
          }
        ]
      });

      const completedCount = progress.filter(p => p.isCompleted).length;
      const totalStudents = progress.length;
      const averageScore = progress.length > 0 
        ? Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length)
        : 0;

      return {
        ...assignment.toJSON(),
        studentsCompleted: completedCount,
        totalStudents,
        averageScore,
        dueDate: assignment.dueDate || null
      };
    }));

    res.json({
      success: true,
      assignments: assignmentsWithProgress
    });

  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching assignments'
    });
  }
});

// Create new assignment
router.post('/assignments', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const {
      title,
      subject,
      grade,
      content,
      description,
      difficulty = 'beginner',
      estimatedDuration,
      dueDate,
      assignmentType = 'lesson', // lesson, puzzle, quiz, project
      puzzleType, // drag-drop, matching, sequencing, fill-blank
      questions = [],
      instructions = []
    } = req.body;

    // Validate required fields
    if (!title || !subject || !grade || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title, subject, grade, and content are required'
      });
    }

    const assignment = await Lesson.create({
      title,
      subject,
      grade,
      content,
      description,
      difficulty,
      estimatedDuration,
      dueDate,
      assignmentType,
      puzzleType,
      questions: JSON.stringify(questions),
      instructions: JSON.stringify(instructions),
      teacherId,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      assignment: assignment.toJSON()
    });

  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error creating assignment'
    });
  }
});

// Update assignment
router.put('/assignments/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const assignmentId = req.params.id;
    const updateData = req.body;

    // Check if assignment belongs to teacher
    const assignment = await Lesson.findOne({
      where: { id: assignmentId, teacherId }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied'
      });
    }

    // Update assignment
    await assignment.update(updateData);

    res.json({
      success: true,
      assignment: assignment.toJSON()
    });

  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error updating assignment'
    });
  }
});

// Publish assignment
router.post('/assignments/:id/publish', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const assignmentId = req.params.id;

    const assignment = await Lesson.findOne({
      where: { id: assignmentId, teacherId }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied'
      });
    }

    await assignment.update({ status: 'published' });

    res.json({
      success: true,
      message: 'Assignment published successfully'
    });

  } catch (error) {
    console.error('Error publishing assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error publishing assignment'
    });
  }
});

// Delete assignment
router.delete('/assignments/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const assignmentId = req.params.id;

    const assignment = await Lesson.findOne({
      where: { id: assignmentId, teacherId }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied'
      });
    }

    await assignment.destroy();

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error deleting assignment'
    });
  }
});

// Get analytics data
router.get('/analytics', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.user.userId;
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

    // Get lesson performance
    const lessons = await Lesson.findAll({
      where: { teacherId },
      include: [
        {
          model: Progress,
          as: 'progress',
          where: {
            createdAt: {
              [require('sequelize').Op.gte]: startDate
            }
          },
          required: false
        }
      ]
    });

    // Calculate analytics
    const totalLessons = lessons.length;
    const totalStudents = await User.count({
      where: { role: 'learner' },
      include: [
        {
          model: LearningClass,
          as: 'enrolledClasses',
          where: { teacherId }
        }
      ]
    });

    const totalProgress = await Progress.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          where: { teacherId }
        }
      ]
    });

    const completedProgress = await Progress.count({
      where: {
        isCompleted: true,
        createdAt: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          where: { teacherId }
        }
      ]
    });

    const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          activeStudents: totalStudents,
          totalLessons,
          completedLessons: completedProgress,
          averageScore: completionRate,
          totalAssignments: totalProgress,
          submittedAssignments: completedProgress
        },
        students: [],
        performance: {
          subjectPerformance: [],
          gradeDistribution: [],
          progressTrends: []
        }
      }
    });

  } catch (error) {
    console.error('Error fetching teacher analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching analytics'
    });
  }
});

module.exports = router;
