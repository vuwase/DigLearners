// Authentication API - Based on Use Case Diagram
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'diglearners-secret-key-2024';

// Register endpoint 
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role = 'learner', grade, age } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and password are required'
      });
    }

    // Prevent admin registration through public endpoint
    if (role === 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin accounts can only be created by administrators' 
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
      password: password, // Will be hashed by model hook
      role
    };

    // Add grade and age if provided (for learners)
    if (grade) {
      userData.grade = grade;
    }
    if (age) {
      userData.age = parseInt(age);
    }

    // Generate registration code for learners (students)
    if (role === 'learner') {
      userData.registrationCode = await User.generateUniqueRegistrationCode();
    }

    // Create new user
    console.log('Creating user with data:', { ...userData, password: '***' });
    const user = await User.create(userData);
    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt
    });

    // Verify user was saved by fetching it
    const savedUser = await User.findByPk(user.id);
    if (!savedUser) {
      console.error('ERROR: User was created but not found in database!');
      throw new Error('User was created but could not be verified in database');
    }
    console.log('User verification: User exists in database with ID:', savedUser.id);

    // Prepare response
    const response = {
      success: true,
      message: 'User registered successfully! Please login to continue.',
      user: user.toJSON()
    };

    // Include registration code in response for learners
    if (role === 'learner' && user.registrationCode) {
      response.registrationCode = user.registrationCode;
      response.message = `Student registered successfully! Registration code: ${user.registrationCode}`;
    }

    // Add verification info for teachers
    if (role === 'teacher') {
      response.message = `Teacher account created successfully! You can now login with email: ${user.email}`;
      response.userCreated = true;
      response.userId = user.id;
    }

    console.log('Registration response:', { 
      success: response.success, 
      userId: response.userId || response.user?.id,
      email: response.user?.email 
    });

    res.status(201).json(response);

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
      stack: error.stack
    });

    // Provide more detailed error messages
    let errorMessage = 'Internal server error during registration';
    let statusCode = 500;

    if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'An account with this email already exists. Please login instead.';
      statusCode = 400;
    } else if (error.name === 'SequelizeValidationError') {
      errorMessage = 'Validation error: ' + (error.errors?.map(e => e.message).join(', ') || 'Invalid data provided');
      statusCode = 400;
    } else if (error.name === 'SequelizeDatabaseError') {
      errorMessage = 'Database error during registration. Please contact support.';
      statusCode = 500;
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      errorDetails: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message
      } : undefined
    });
  }
});

// Login endpoint - Handles both teacher and student login
router.post('/login', async (req, res) => {
  try {
    const { email, password, fullName, grade, registrationCode, loginType } = req.body;

    // Handle teacher login (email/password)
    if (loginType === 'teacher' || (!loginType && email && password && !fullName && !grade)) {
      // Validate input for teacher login
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
          errorType: 'missing_credentials'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid email address',
          errorType: 'invalid_email_format'
        });
      }

      // Find user by email
      console.log('Attempting teacher login for email:', email);
      const user = await User.findByEmail(email);
      if (!user) {
        console.log('Login failed: No user found with email:', email);
        return res.status(401).json({
          success: false,
          error: 'No account found with this email address. Please check your email or create a new account.',
          errorType: 'email_not_found'
        });
      }
      console.log('User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      });

      // Check if user is a teacher
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'This login method is only for teachers. Please use student login instead.',
          errorType: 'wrong_login_type'
        });
      }

      // Validate password
      console.log('Validating password for user:', user.email);
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        console.log('Login failed: Invalid password for user:', user.email);
        return res.status(401).json({
          success: false,
          error: 'Incorrect password. Please try again or contact support if you need help.',
          errorType: 'incorrect_password'
        });
      }
      console.log('Password validated successfully for user:', user.email);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('Login successful for user:', {
        id: user.id,
        email: user.email,
        role: user.role,
        tokenGenerated: !!token
      });

      return res.json({
        success: true,
        message: 'Login successful',
        user: user.toJSON(),
        token
      });
    }

    // Handle student login (question-based)
    if (loginType === 'student' || (!loginType && fullName && grade && registrationCode)) {
      // Validate input for student login
      if (!fullName || !grade || !registrationCode) {
        return res.status(400).json({
          success: false,
          error: 'Name, grade, and registration code are required for student login',
          errorType: 'missing_student_info'
        });
      }

      // Validate registration code format (6 characters, alphanumeric)
      const codeRegex = /^[A-Z0-9]{6}$/;
      if (!codeRegex.test(registrationCode.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: 'Registration code must be 6 characters (letters and numbers only)',
          errorType: 'invalid_registration_code_format'
        });
      }

      // Normalize grade format - handle both "Grade X" and "X" formats
      let normalizedGrade = grade.trim();
      if (normalizedGrade.startsWith('Grade ')) {
        normalizedGrade = normalizedGrade.replace('Grade ', '').trim();
      }

      console.log('[Login] Searching for student:', {
        registrationCode: registrationCode.toUpperCase(),
        fullName: fullName.trim(),
        grade: normalizedGrade,
        originalGrade: grade
      });

      // Find student by registration code, name, and grade
      // Try exact match first, then try with normalized grade
      let user = await User.findOne({
        where: {
          registrationCode: registrationCode.toUpperCase(),
          fullName: fullName.trim(),
          grade: normalizedGrade,
          role: 'learner'
        }
      });

      // If not found with normalized grade, try with original grade
      if (!user && normalizedGrade !== grade.trim()) {
        user = await User.findOne({
          where: {
            registrationCode: registrationCode.toUpperCase(),
            fullName: fullName.trim(),
            grade: grade.trim(),
            role: 'learner'
          }
        });
      }

      if (!user) {
        // Log what we searched for to help debug
        console.log('[Login] Student not found. Searched with:', {
          registrationCode: registrationCode.toUpperCase(),
          fullName: fullName.trim(),
          grade: normalizedGrade
        });
        
        // Also check if any students exist with this registration code to help debug
        const codeCheck = await User.findOne({
          where: {
            registrationCode: registrationCode.toUpperCase(),
            role: 'learner'
          },
          attributes: ['id', 'fullName', 'grade', 'registrationCode']
        });
        
        if (codeCheck) {
          console.log('[Login] Found student with this code but different name/grade:', {
            foundName: codeCheck.fullName,
            foundGrade: codeCheck.grade,
            searchedName: fullName.trim(),
            searchedGrade: normalizedGrade
          });
        }
        
        return res.status(401).json({
          success: false,
          error: 'No student found with these details. Please check your name, grade, and registration code.',
          errorType: 'student_not_found'
        });
      }

      // Generate JWT token for student
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Student login successful',
        user: user.toJSON(),
        token
      });
    }

    // Invalid login request
    return res.status(400).json({
      success: false,
      error: 'Invalid login request. Please provide either teacher credentials (email/password) or student information (name/grade/registration code).',
      errorType: 'invalid_login_request'
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific database connection errors
    if (error.name === 'SequelizeConnectionError') {
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable. Please try again in a few moments.',
        errorType: 'service_unavailable'
      });
    }
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid login data provided',
        errorType: 'validation_error'
      });
    }
    
    // Generic server error
    res.status(500).json({
      success: false,
      error: 'Internal server error during login. Please try again later.',
      errorType: 'server_error'
    });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more sophisticated implementation, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during logout'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: ['badges', 'classes']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use'
        });
      }
    }

    // Update user
    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error updating profile'
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Validate current password
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    await user.update({ passwordHash: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error changing password'
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user.toJSON(),
      valid: true
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error verifying token'
    });
  }
});

// Admin-only endpoint to create teacher accounts
router.post('/admin/create-teacher', authenticateToken, async (req, res) => {
  try {
    // Check if the requesting user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only administrators can create teacher accounts'
      });
    }

    const { fullName, email, password } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and password are required'
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

    // Create teacher account
    const teacher = await User.create({
      fullName,
      email,
      passwordHash: password, // Will be hashed by model hook
      role: 'teacher'
    });

    res.status(201).json({
      success: true,
      message: 'Teacher account created successfully',
      user: teacher.toJSON()
    });
  } catch (error) {
    console.error('Teacher creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during teacher creation' 
    });
  }
});

module.exports = router;