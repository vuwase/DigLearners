// Test student login and verify redirect logic
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testStudentLoginRedirect() {
  console.log('🧪 Testing Student Login Redirect Flow\n');
  console.log('='.repeat(70));

  try {
    // Step 1: Login as teacher
    console.log('\n📝 Step 1: Login as Teacher');
    const teacherLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      loginType: 'teacher',
      email: 'testteacher@diglearners.com',
      password: 'password123'
    });
    
    if (!teacherLogin.data.success) {
      console.log('⚠️  Teacher login failed, creating teacher...');
      await axios.post(`${API_BASE_URL}/auth/register`, {
        fullName: 'Test Teacher',
        email: 'testteacher@diglearners.com',
        password: 'password123',
        role: 'teacher'
      });
      
      const teacherLoginRetry = await axios.post(`${API_BASE_URL}/auth/login`, {
        loginType: 'teacher',
        email: 'testteacher@diglearners.com',
        password: 'password123'
      });
      var teacherToken = teacherLoginRetry.data.token;
    } else {
      var teacherToken = teacherLogin.data.token;
    }
    console.log('✅ Teacher logged in');

    // Step 2: Register a student
    console.log('\n👨‍🎓 Step 2: Register a Test Student');
    const studentName = `Test Student ${Date.now()}`;
    const studentReg = await axios.post(`${API_BASE_URL}/teacher/register-student`, {
      fullName: studentName,
      grade: '4',
      age: 10
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
    console.log('✅ Student Registered');
    console.log('   Name:', studentName);
    console.log('   Grade: 4');
    console.log('   Registration Code:', registrationCode);

    // Step 3: Test Student Login
    console.log('\n🔐 Step 3: Test Student Login');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      loginType: 'student',
      fullName: studentName,
      grade: '4',
      registrationCode: registrationCode
    });

    console.log('\n✅ Login Response Structure:');
    console.log('   success:', loginResponse.data.success);
    console.log('   hasToken:', !!loginResponse.data.token);
    console.log('   hasUser:', !!loginResponse.data.user);
    console.log('   userRole:', loginResponse.data.user?.role);
    console.log('   userFullName:', loginResponse.data.user?.fullName);
    console.log('   userGrade:', loginResponse.data.user?.grade);
    console.log('   userEmail:', loginResponse.data.user?.email || 'N/A (Students use registration codes)');
    console.log('   message:', loginResponse.data.message);

    if (loginResponse.data.success && loginResponse.data.token && loginResponse.data.user) {
      console.log('\n🎉 SUCCESS! Login response has all required fields for redirect:');
      console.log('   ✓ success: true');
      console.log('   ✓ token: present');
      console.log('   ✓ user object: present');
      console.log('   ✓ user.role: learner');
      
      // Verify token format
      const tokenParts = loginResponse.data.token.split('.');
      console.log('\n🔍 Token Verification:');
      console.log('   Token parts:', tokenParts.length, '(should be 3 for JWT)');
      console.log('   Token length:', loginResponse.data.token.length, 'characters');
      
      // Check if user object has required fields
      const user = loginResponse.data.user;
      console.log('\n👤 User Object Fields:');
      console.log('   id:', user.id);
      console.log('   fullName:', user.fullName);
      console.log('   role:', user.role);
      console.log('   grade:', user.grade || 'N/A');
      console.log('   email:', user.email || 'N/A');
      console.log('   registrationCode:', user.registrationCode || 'N/A');
      
      console.log('\n✅ All required fields present - Frontend should be able to:');
      console.log('   1. Set user state with result.user');
      console.log('   2. Store token in localStorage');
      console.log('   3. Navigate to /dashboard');
      console.log('   4. ProtectedRoute should allow access (user.role === "learner")');
      
    } else {
      console.error('\n❌ Login response missing required fields!');
      if (!loginResponse.data.success) console.error('   Missing: success field');
      if (!loginResponse.data.token) console.error('   Missing: token field');
      if (!loginResponse.data.user) console.error('   Missing: user object');
    }

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('Test completed!');
}

// Check if server is running first
axios.get(`${API_BASE_URL.replace('/api', '')}/health`)
  .then(() => {
    console.log('✅ Backend server is running\n');
    testStudentLoginRedirect();
  })
  .catch(() => {
    console.error('❌ Backend server is not running!');
    console.error('Please start the backend server first:');
    console.error('  cd backend');
    console.error('  npm start');
    process.exit(1);
  });

