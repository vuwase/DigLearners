// Authentication Middleware
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'diglearners-secret-key-2024';

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during authentication'
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = authorizeRoles('admin');

// Check if user is teacher or admin
const requireTeacher = authorizeRoles('teacher', 'admin');

// Check if user is learner, teacher, or admin
const requireLearner = authorizeRoles('learner', 'teacher', 'admin');

// Check if user is parent, teacher, or admin
const requireParent = authorizeRoles('parent', 'teacher', 'admin');

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      
      if (user) {
        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Rate limiting middleware (simple implementation)
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }

    // Check current IP
    const userRequests = Array.from(requests.entries())
      .filter(([key, timestamp]) => key.startsWith(ip) && timestamp > windowStart)
      .length;

    if (userRequests >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later'
      });
    }

    // Record this request
    requests.set(`${ip}-${now}`, now);

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireTeacher,
  requireLearner,
  requireParent,
  optionalAuth,
  rateLimit
};
