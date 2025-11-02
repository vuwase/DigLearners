// Test complete student login flow
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testStudentLoginFlow() {
  console.log('🧪 Testing Complete Student Login Flow\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Check if we have a teacher, if not create one
    console.log('\n📝 Step 1: Ensure Teacher Account Exists');
    let teacherEmail = 'testteacher@diglearners.com';
    let teacherPassword = 'password123';
    
    try {
      // Try to login first
      const loginCheck = await axios.post(`${API_BASE_URL}/auth/login`, {
        loginType: 'teacher',
        email: teacherEmail,
        password: teacherPassword
      });
      console.log('✅ Teacher account exists, logged in successfully');
      var teacherToken = loginCheck.data.token;
    } catch (error) {
      // Teacher doesn't exist, create one
      console.log('⚠️  Teacher not found, creating new teacher...');
      const teacherReg = await axios.post(`${API_BASE_URL}/auth/register`, {
        fullName: 'Test Teacher',
        email: teacherEmail,
        password: teacherPassword,
        role: 'teacher'
      });
      console.log('✅ Teacher created:', teacherReg.data.user?.email);
      
      // Login as teacher
      const teacherLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
        loginType: 'teacher',
        email: teacherEmail,
        password: teacherPassword
      });
      teacherToken = teacherLogin.data.token;
      console.log('✅ Teacher logged in');
    }

    // Step 2: Register a student
    console.log('\n👨‍🎓 Step 2: Register a Test Student');
    const studentName = 'Test Student ' + Date.now();
    const studentGrade = '4';
    const studentAge = 10;

    const studentReg = await axios.post(`${API_BASE_URL}/teacher/register-student`, {
      fullName: studentName,
      grade: studentGrade,
      age: studentAge
    }, {
      headers: {
        'Authorization': `Bearer ${teacherToken}`
      }
    });

    if (!studentReg.data.success) {
      console.error('❌ Student registration failed:', studentReg.data.error);
      return;
    }

    const registrationCode = studentReg.data.data?.registrationCode;
    const registeredStudent = studentReg.data.data;

    console.log('✅ Student Registered Successfully!');
    console.log('Student Details:');
    console.log('  Name:', registeredStudent.fullName);
    console.log('  Grade:', registeredStudent.grade);
    console.log('  Age:', registeredStudent.age);
    console.log('  Registration Code:', registrationCode);
    console.log('  User ID:', registeredStudent.id);

    // Step 3: Test Student Login
    console.log('\n🔐 Step 3: Test Student Login');
    console.log('Attempting login with:');
    console.log('  Name:', studentName);
    console.log('  Grade:', studentGrade);
    console.log('  Code:', registrationCode);

    const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      loginType: 'student',
      fullName: studentName,
      grade: studentGrade,
      registrationCode: registrationCode
    });

    console.log('\n✅ Student Login Response:');
    console.log('  Success:', studentLogin.data.success);
    console.log('  Has Token:', !!studentLogin.data.token);
    console.log('  User ID:', studentLogin.data.user?.id);
    console.log('  Name:', studentLogin.data.user?.fullName);
    console.log('  Grade:', studentLogin.data.user?.grade);
    console.log('  Role:', studentLogin.data.user?.role);
    console.log('  Message:', studentLogin.data.message);

    if (studentLogin.data.success && studentLogin.data.token) {
      console.log('\n🎉 SUCCESS! Student login is working perfectly!');
      console.log('Token received:', studentLogin.data.token.substring(0, 30) + '...');
      
      // Step 4: Verify token works
      console.log('\n🔍 Step 4: Verify Authentication Token');
      try {
        const verifyResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${studentLogin.data.token}`
          }
        });
        console.log('✅ Token verified! Profile:');
        console.log('  User ID:', verifyResponse.data.user.id);
        console.log('  Name:', verifyResponse.data.user.fullName);
        console.log('  Role:', verifyResponse.data.user.role);
      } catch (error) {
        console.error('❌ Token verification failed:', error.response?.data?.error || error.message);
      }
    } else {
      console.error('\n❌ Student login failed!');
    }

    // Step 5: Test wrong credentials
    console.log('\n🔒 Step 5: Test Error Handling (Wrong Code)');
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        loginType: 'student',
        fullName: studentName,
        grade: studentGrade,
        registrationCode: 'WRONG1'
      });
      console.error('❌ ERROR: Login should have failed with wrong code!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected wrong registration code');
        console.log('Error message:', error.response.data.error);
      } else {
        console.error('❌ Unexpected error:', error.message);
      }
    }

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('❌ No response from server. Is the backend running on', API_BASE_URL, '?');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test completed!');
}

// Check if server is running first
axios.get(`${API_BASE_URL.replace('/api', '')}/health`)
  .then(() => {
    console.log('✅ Backend server is running\n');
    testStudentLoginFlow();
  })
  .catch(() => {
    console.error('❌ Backend server is not running!');
    console.error('Please start the backend server first:');
    console.error('  cd backend');
    console.error('  npm start');
    process.exit(1);
  });

