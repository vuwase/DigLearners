const request = require('supertest');
const { app } = require('../server');
const { User } = require('../models');
const { sequelize } = require('../models');
const jwt = require('jsonwebtoken');

describe('Teacher Endpoints', () => {
  let server;
  let testTeacher;
  let teacherToken;
  let testStudent;

  beforeAll(async () => {
    // Start the server
    server = app.listen(0);
    
    // Sync database
    await sequelize.sync({ force: true });
    
    // Create test teacher
    testTeacher = await User.create({
      fullName: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher'
    });

    // Generate teacher token
    teacherToken = jwt.sign(
      { 
        userId: testTeacher.id, 
        email: testTeacher.email, 
        role: testTeacher.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Create test student
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
    await sequelize.close();
    server.close();
  });

  describe('POST /api/teacher/register-student', () => {
    test('should register a new student with valid data', async () => {
      const response = await request(app)
        .post('/api/teacher/register-student')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          fullName: 'New Test Student',
          grade: '4',
          age: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.registrationCode).toBeDefined();
      expect(response.body.data.registrationCode).toMatch(/^[A-Z0-9]{6}$/);
      expect(response.body.data.fullName).toBe('New Test Student');
      expect(response.body.data.grade).toBe('4');
      expect(response.body.data.role).toBe('learner');
      expect(response.body.message).toContain('Registration code:');
    });

    test('should register student without age (optional field)', async () => {
      const response = await request(app)
        .post('/api/teacher/register-student')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          fullName: 'Student Without Age',
          grade: '2'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.age).toBeNull();
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/teacher/register-student')
        .send({
          fullName: 'Unauthorized Student',
          grade: '3'
        });

      expect(response.status).toBe(401);
    });

    test('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/teacher/register-student')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          fullName: 'Incomplete Student'
          // missing grade
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/api/teacher/register-student')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          fullName: 'Student With Invalid Token',
          grade: '3'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/teacher/my-students', () => {
    test('should get all students with registration codes', async () => {
      const response = await request(app)
        .get('/api/teacher/my-students')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check student data structure
      const student = response.body.data[0];
      expect(student).toHaveProperty('id');
      expect(student).toHaveProperty('fullName');
      expect(student).toHaveProperty('grade');
      expect(student).toHaveProperty('registrationCode');
      expect(student).toHaveProperty('totalPoints');
      expect(student).toHaveProperty('createdAt');
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/teacher/my-students');

      expect(response.status).toBe(401);
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/teacher/my-students')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/teacher/students', () => {
    test('should get students for teacher dashboard', async () => {
      const response = await request(app)
        .get('/api/teacher/students')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/teacher/students');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/teacher/dashboard', () => {
    test('should get teacher dashboard data', async () => {
      const response = await request(app)
        .get('/api/teacher/dashboard')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalStudents');
      expect(response.body.data).toHaveProperty('totalLessons');
      expect(response.body.data).toHaveProperty('totalAssignments');
      expect(response.body.data).toHaveProperty('averageProgress');
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/teacher/dashboard');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/teacher/analytics', () => {
    test('should get teacher analytics data', async () => {
      const response = await request(app)
        .get('/api/teacher/analytics')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('overview');
      expect(response.body.data).toHaveProperty('students');
      expect(response.body.data).toHaveProperty('performance');
    });

    test('should accept period parameter', async () => {
      const response = await request(app)
        .get('/api/teacher/analytics?period=month')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/teacher/analytics');

      expect(response.status).toBe(401);
    });
  });

  describe('Role-based Access Control', () => {
    let studentToken;

    beforeAll(async () => {
      // Create student token
      studentToken = jwt.sign(
        { 
          userId: testStudent.id, 
          role: testStudent.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
    });

    test('should deny student access to teacher endpoints', async () => {
      const response = await request(app)
        .post('/api/teacher/register-student')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          fullName: 'Unauthorized Registration',
          grade: '3'
        });

      expect(response.status).toBe(403);
    });

    test('should deny student access to teacher analytics', async () => {
      const response = await request(app)
        .get('/api/teacher/analytics')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });
});
