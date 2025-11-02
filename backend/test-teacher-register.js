// Test teacher registering students
const request = require('supertest');
const { app } = require('./server');

async function testTeacherRegisterStudent() {
  try {
    console.log('🚀 Testing teacher student registration...\n');

    // Step 1: Login as teacher
    console.log('📝 Step 1: Teacher login...');
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        loginType: 'teacher',
        email: 'testteacher@diglearners.com',
        password: 'password123'
      });

    console.log('Login status:', loginResponse.status);
    console.log('Login success:', loginResponse.body.success);
    
    if (!loginResponse.body.success) {
      console.error('❌ Teacher login failed');
      return;
    }

    const teacherToken = loginResponse.body.token;
    console.log('✅ Teacher logged in successfully');

    // Step 2: Register a student
    console.log('\n📝 Step 2: Teacher registering a student...');
    const registerResponse = await request(app)
      .post('/api/teacher/register-student')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        fullName: 'New Test Student',
        grade: '4',
        age: 10
      });

    console.log('Register status:', registerResponse.status);
    console.log('Register response:', registerResponse.body);

    if (registerResponse.body.success) {
      const registrationCode = registerResponse.body.data.registrationCode;
      console.log('✅ Student registered successfully!');
      console.log('Registration Code:', registrationCode);

      // Step 3: Test student login with the new code
      console.log('\n📝 Step 3: Testing student login with new code...');
      const studentLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          loginType: 'student',
          fullName: 'New Test Student',
          grade: '4',
          registrationCode: registrationCode
        });

      console.log('Student login status:', studentLoginResponse.status);
      console.log('Student login success:', studentLoginResponse.body.success);

      if (studentLoginResponse.body.success) {
        console.log('✅ Student login successful!');
        console.log('Student user:', {
          id: studentLoginResponse.body.user.id,
          fullName: studentLoginResponse.body.user.fullName,
          grade: studentLoginResponse.body.user.grade,
          registrationCode: studentLoginResponse.body.user.registrationCode
        });
      } else {
        console.log('❌ Student login failed:', studentLoginResponse.body.error);
      }
    } else {
      console.log('❌ Student registration failed:', registerResponse.body.error);
    }

    console.log('\n🎉 Teacher-student registration test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTeacherRegisterStudent();
