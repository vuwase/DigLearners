// Test login endpoints manually
const { User } = require('./models');
const { sequelize } = require('./models');
const request = require('supertest');
const { app } = require('./server');

async function testLoginEndpoints() {
  try {
    console.log('🚀 Starting login endpoint tests...\n');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced\n');

    // Create test users
    const teacher = await User.create({
      fullName: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher'
    });

    const registrationCode = await User.generateUniqueRegistrationCode();
    const student = await User.create({
      fullName: 'Test Student',
      role: 'learner',
      grade: '3',
      age: 9,
      registrationCode
    });

    console.log('✅ Test users created');
    console.log('Teacher:', { email: teacher.email });
    console.log('Student:', { name: student.fullName, code: student.registrationCode });

    // Test 1: Teacher login
    console.log('\n📝 Test 1: Teacher login...');
    const teacherLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        loginType: 'teacher',
        email: 'teacher@test.com',
        password: 'password123'
      });

    console.log('Teacher login status:', teacherLoginResponse.status);
    console.log('Teacher login response:', teacherLoginResponse.body);

    // Test 2: Student login
    console.log('\n📝 Test 2: Student login...');
    const studentLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        loginType: 'student',
        fullName: 'Test Student',
        grade: '3',
        registrationCode: registrationCode
      });

    console.log('Student login status:', studentLoginResponse.status);
    console.log('Student login response:', studentLoginResponse.body);

    // Test 3: Teacher registration of student
    if (teacherLoginResponse.body.token) {
      console.log('\n📝 Test 3: Teacher registering a new student...');
      const registerStudentResponse = await request(app)
        .post('/api/teacher/register-student')
        .set('Authorization', `Bearer ${teacherLoginResponse.body.token}`)
        .send({
          fullName: 'New Test Student',
          grade: '4',
          age: 10
        });

      console.log('Register student status:', registerStudentResponse.status);
      console.log('Register student response:', registerStudentResponse.body);
    }

    console.log('\n🎉 All login tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

// Run the tests
testLoginEndpoints();
