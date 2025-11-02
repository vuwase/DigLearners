// User Model - Based on ERD Diagram
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
        // Email is required for teachers and admins, optional for learners
        customEmailValidation(value) {
          if ((this.role === 'teacher' || this.role === 'admin') && !value) {
            throw new Error('Email is required for teachers and admins');
          }
        }
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      validate: {
        len: [6, 100]
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'password_hash',
      validate: {
        // Password is required for teachers and admins, optional for learners with registration codes
        customPasswordValidation(value) {
          if ((this.role === 'teacher' || this.role === 'admin') && !value) {
            throw new Error('Password is required for teachers and admins');
          }
          if (this.role === 'learner' && !value && !this.registrationCode) {
            throw new Error('Learners must have either a password or registration code');
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'teacher', 'learner'),
      allowNull: false,
      defaultValue: 'learner'
    },
    registrationCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
      field: 'registration_code',
      validate: {
        len: [6, 10]
      }
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_points'
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 3,
        max: 18
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: async (user) => {
        if (user.password) {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.passwordHash = hashedPassword;
        }
      },
      beforeCreate: async (user) => {
        if (user.password && !user.passwordHash) {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.passwordHash = hashedPassword;
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.passwordHash = hashedPassword;
        }
      }
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.passwordHash;
    return values;
  };

  // Class methods
  User.findByEmail = async function(email) {
    return await this.findOne({ where: { email } });
  };

  User.findByRole = async function(role) {
    return await this.findAll({ where: { role } });
  };

  User.findByRegistrationCode = async function(registrationCode) {
    return await this.findOne({ where: { registrationCode } });
  };

  User.generateRegistrationCode = function() {
    // Generate a 6-character alphanumeric code (uppercase letters and numbers)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  User.generateUniqueRegistrationCode = async function() {
    let code;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = this.generateRegistrationCode();
      const existingUser = await this.findByRegistrationCode(code);
      if (!existingUser) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Unable to generate unique registration code');
    }

    return code;
  };

  return User;
};
