const request = require('supertest');
const { app } = require('../server');
const { User } = require('../models');
const { sequelize } = require('../models');

describe('Authentication Endpoints', () => {
  let server;
  let testTeacher;
  let testStudent;

  beforeAll(async () => {
    // Start the server
    server = app.listen(0); // Use random port for testing
    
    // Sync database
    await sequelize.sync({ force: true });
    
    // Create test users
    testTeacher = await User.create({
      fullName: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher',
      grade: null,
      age: null
    });

    const registrationCode = await User.generateUniqueRegistrationCode();
    testStudent = await User.create({
      fullName: 'Test Student',
      role: 'learner',
      grade: '3',
      age: 9,
      registrationCode
    });
  });

  afterAll(async () => {
    // Clean up
    await sequelize.close();
    server.close();
  });

  describe('POST /api/auth/login', () => {
    describe('Teacher Login', () => {
      test('should login teacher with valid credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'teacher',
            email: 'teacher@test.com',
            password: 'password123'
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.role).toBe('teacher');
        expect(response.body.user.email).toBe('teacher@test.com');
      });

      test('should fail teacher login with invalid email', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'teacher',
            email: 'wrong@test.com',
            password: 'password123'
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('invalid_credentials');
      });

      test('should fail teacher login with invalid password', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'teacher',
            email: 'teacher@test.com',
            password: 'wrongpassword'
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('invalid_credentials');
      });

      test('should fail teacher login with missing fields', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'teacher',
            email: 'teacher@test.com'
            // missing password
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('missing_credentials');
      });
    });

    describe('Student Login', () => {
      test('should login student with valid details', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'student',
            fullName: 'Test Student',
            grade: '3',
            registrationCode: testStudent.registrationCode
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.role).toBe('learner');
        expect(response.body.user.fullName).toBe('Test Student');
      });

      test('should fail student login with wrong name', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'student',
            fullName: 'Wrong Name',
            grade: '3',
            registrationCode: testStudent.registrationCode
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('student_not_found');
      });

      test('should fail student login with wrong grade', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'student',
            fullName: 'Test Student',
            grade: '5',
            registrationCode: testStudent.registrationCode
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('student_not_found');
      });

      test('should fail student login with invalid registration code format', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'student',
            fullName: 'Test Student',
            grade: '3',
            registrationCode: 'invalid'
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('invalid_registration_code_format');
      });

      test('should fail student login with missing fields', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'student',
            fullName: 'Test Student'
            // missing grade and registrationCode
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('missing_student_info');
      });
    });

    describe('Auto-detection Login', () => {
      test('should auto-detect teacher login', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'teacher@test.com',
            password: 'password123'
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user.role).toBe('teacher');
      });

      test('should auto-detect student login', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            fullName: 'Test Student',
            grade: '3',
            registrationCode: testStudent.registrationCode
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user.role).toBe('learner');
      });
    });

    describe('Invalid Login Requests', () => {
      test('should fail with invalid login type', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'invalid',
            email: 'teacher@test.com',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('invalid_login_request');
      });

      test('should fail with mixed login data', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'teacher@test.com',
            fullName: 'Test Student',
            grade: '3'
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errorType).toBe('invalid_login_request');
      });
    });
  });

  describe('POST /api/auth/register', () => {
    test('should register a new learner with registration code', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'New Student',
          email: 'newstudent@test.com',
          password: 'password123',
          role: 'learner',
          grade: '4',
          age: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.registrationCode).toBeDefined();
      expect(response.body.registrationCode).toMatch(/^[A-Z0-9]{6}$/);
      expect(response.body.message).toContain('Registration code:');
    });

    test('should register a new teacher without registration code', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'New Teacher',
          email: 'newteacher@test.com',
          password: 'password123',
          role: 'teacher'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.registrationCode).toBeUndefined();
      expect(response.body.user.role).toBe('teacher');
    });

    test('should fail registration with duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Duplicate Teacher',
          email: 'teacher@test.com', // Already exists
          password: 'password123',
          role: 'teacher'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    test('should fail registration with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Incomplete User'
          // missing email, password, role
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
