// Test student registration by teacher
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testStudentRegistration() {
  console.log('🧪 Testing Student Registration (via Teacher API)\n');
  console.log('=' .repeat(60));

  // First, create a teacher and get token
  const teacherEmail = `teacher${Date.now()}@test.com`;
  const teacherPassword = 'password123';

  try {
    // Register teacher
    console.log('\n📝 Step 1: Register Teacher');
    const teacherReg = await axios.post(`${API_BASE_URL}/auth/register`, {
      fullName: 'Test Teacher',
      email: teacherEmail,
      password: teacherPassword,
      role: 'teacher'
    });
    console.log('✅ Teacher registered:', teacherReg.data.user?.email);

    // Login as teacher
    console.log('\n🔐 Step 2: Login as Teacher');
    const teacherLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      loginType: 'teacher',
      email: teacherEmail,
      password: teacherPassword
    });
    const token = teacherLogin.data.token;
    console.log('✅ Teacher logged in, token received');

    // Register student
    console.log('\n👨‍🎓 Step 3: Register Student');
    const studentReg = await axios.post(`${API_BASE_URL}/teacher/register-student`, {
      fullName: 'Test Student',
      grade: '4',
      age: 10
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Student Registration Response:', {
      success: studentReg.data.success,
      registrationCode: studentReg.data.data?.registrationCode,
      studentName: studentReg.data.data?.fullName,
      studentGrade: studentReg.data.data?.grade,
      message: studentReg.data.message
    });

    if (studentReg.data.success && studentReg.data.data?.registrationCode) {
      const regCode = studentReg.data.data.registrationCode;
      
      // Test student login
      console.log('\n🔐 Step 4: Test Student Login');
      const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
        loginType: 'student',
        fullName: 'Test Student',
        grade: '4',
        registrationCode: regCode
      });

      console.log('✅ Student Login Response:', {
        success: studentLogin.data.success,
        hasToken: !!studentLogin.data.token,
        studentName: studentLogin.data.user?.fullName,
        studentGrade: studentLogin.data.user?.grade,
        message: studentLogin.data.message
      });

      if (studentLogin.data.success) {
        console.log('\n🎉 SUCCESS! Student registration and login working correctly!');
      }
    }

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

// Check if server is running
axios.get(`${API_BASE_URL.replace('/api', '')}/health`)
  .then(() => {
    console.log('✅ Backend server is running\n');
    testStudentRegistration();
  })
  .catch(() => {
    console.error('❌ Backend server is not running!');
    console.error('Please start the backend server first:');
    console.error('  cd backend');
    console.error('  npm start');
    process.exit(1);
  });

