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
    const { fullName, email, password, role = 'learner', childName, childEmail, childPassword } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and password are required'
      });
    }

    // Prevent teacher registration through public endpoint
    if (role === 'teacher') {
      return res.status(403).json({ 
        success: false, 
        error: 'Teacher accounts can only be created by administrators' 
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

    // Create new user (parent or regular user)
    const user = await User.create({
      fullName,
      email,
      passwordHash: password, // Will be hashed by model hook
      role
    });

    // If parent is enrolling a child, create child account
    let childUser = null;
    if (role === 'parent' && childName && childEmail && childPassword) {
      // Check if child email already exists
      const existingChild = await User.findByEmail(childEmail);
      if (existingChild) {
        // Delete the parent account we just created since enrollment failed
        await user.destroy();
        return res.status(400).json({
          success: false,
          error: 'A user with this child email already exists'
        });
      }

      // Create child account
      childUser = await User.create({
        fullName: childName,
        email: childEmail,
        passwordHash: childPassword, // Will be hashed by model hook
        role: 'learner'
      });
    }

    res.status(201).json({
      success: true,
      message: childUser 
        ? 'Parent and child accounts created successfully! Please login to continue.'
        : 'User registered successfully! Please login to continue.',
      user: user.toJSON(),
      childUser: childUser ? childUser.toJSON() : null
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

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

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
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