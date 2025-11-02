const request = require('supertest');
const { app } = require('../server');
const { User } = require('../models');
const { sequelize } = require('../models');

describe('Integration Tests - Login Flow', () => {
  let server;

  beforeAll(async () => {
    // Start the server
    server = app.listen(0);
    
    // Sync database
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
    server.close();
  });

  describe('Complete Login Flow', () => {
    test('should complete teacher registration and login flow', async () => {
      // Step 1: Register a teacher
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Integration Test Teacher',
          email: 'integration@teacher.com',
          password: 'password123',
          role: 'teacher'
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.user.role).toBe('teacher');

      // Step 2: Login with the registered teacher
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          loginType: 'teacher',
          email: 'integration@teacher.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();
      expect(loginResponse.body.user.email).toBe('integration@teacher.com');

      // Step 3: Use the token to access protected teacher endpoint
      const dashboardResponse = await request(app)
        .get('/api/teacher/dashboard')
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(dashboardResponse.status).toBe(200);
      expect(dashboardResponse.body.success).toBe(true);
    });

    test('should complete student registration by teacher and student login flow', async () => {
      // Step 1: Create and login as teacher
      const teacher = await User.create({
        fullName: 'Teacher For Student Test',
        email: 'teacher.student@test.com',
        password: 'password123',
        role: 'teacher'
      });

      const teacherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          loginType: 'teacher',
          email: 'teacher.student@test.com',
          password: 'password123'
        });

      expect(teacherLoginResponse.status).toBe(200);
      const teacherToken = teacherLoginResponse.body.token;

      // Step 2: Teacher registers a student
      const studentRegisterResponse = await request(app)
        .post('/api/teacher/register-student')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          fullName: 'Integration Test Student',
          grade: '4',
          age: 10
        });

      expect(studentRegisterResponse.status).toBe(201);
      expect(studentRegisterResponse.body.success).toBe(true);
      expect(studentRegisterResponse.body.data.registrationCode).toBeDefined();

      const registrationCode = studentRegisterResponse.body.data.registrationCode;

      // Step 3: Student logs in using registration code
      const studentLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          loginType: 'student',
          fullName: 'Integration Test Student',
          grade: '4',
          registrationCode: registrationCode
        });

      expect(studentLoginResponse.status).toBe(200);
      expect(studentLoginResponse.body.success).toBe(true);
      expect(studentLoginResponse.body.token).toBeDefined();
      expect(studentLoginResponse.body.user.role).toBe('learner');

      // Step 4: Use student token to access learner endpoint
      const learnerDashboardResponse = await request(app)
        .get('/api/learner/dashboard')
        .set('Authorization', `Bearer ${studentLoginResponse.body.token}`);

      expect(learnerDashboardResponse.status).toBe(200);
      expect(learnerDashboardResponse.body.success).toBe(true);
    });

    test('should handle teacher managing multiple students', async () => {
      // Create teacher
      const teacher = await User.create({
        fullName: 'Multi Student Teacher',
        email: 'multi@teacher.com',
        password: 'password123',
        role: 'teacher'
      });

      const teacherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          loginType: 'teacher',
          email: 'multi@teacher.com',
          password: 'password123'
        });

      const teacherToken = teacherLoginResponse.body.token;

      // Register multiple students
      const students = [];
      for (let i = 1; i <= 3; i++) {
        const studentResponse = await request(app)
          .post('/api/teacher/register-student')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({
            fullName: `Student ${i}`,
            grade: `${i + 2}`,
            age: i + 8
          });

        expect(studentResponse.status).toBe(201);
        students.push(studentResponse.body.data);
      }

      // Get all students
      const studentsListResponse = await request(app)
        .get('/api/teacher/my-students')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(studentsListResponse.status).toBe(200);
      expect(studentsListResponse.body.data.length).toBeGreaterThanOrEqual(3);

      // Verify each student can login
      for (const student of students) {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            loginType: 'student',
            fullName: student.fullName,
            grade: student.grade,
            registrationCode: student.registrationCode
          });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.success).toBe(true);
      }
    });

    test('should handle edge cases and error scenarios', async () => {
      // Test duplicate registration code handling
      const teacher = await User.create({
        fullName: 'Edge Case Teacher',
        email: 'edge@teacher.com',
        password: 'password123',
        role: 'teacher'
      });

      const teacherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          loginType: 'teacher',
          email: 'edge@teacher.com',
          password: 'password123'
        });

      const teacherToken = teacherLoginResponse.body.token;

      // Register many students to potentially trigger code collision
      const registrationCodes = new Set();
      for (let i = 1; i <= 10; i++) {
        const studentResponse = await request(app)
          .post('/api/teacher/register-student')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({
            fullName: `Edge Student ${i}`,
            grade: '3'
          });

        expect(studentResponse.status).toBe(201);
        const code = studentResponse.body.data.registrationCode;
        
        // Ensure all codes are unique
        expect(registrationCodes.has(code)).toBe(false);
        registrationCodes.add(code);
      }

      // Test invalid login attempts
      const invalidLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          loginType: 'student',
          fullName: 'Non Existent Student',
          grade: '3',
          registrationCode: 'FAKE01'
        });

      expect(invalidLoginResponse.status).toBe(401);
      expect(invalidLoginResponse.body.success).toBe(false);
    });
  });
});
