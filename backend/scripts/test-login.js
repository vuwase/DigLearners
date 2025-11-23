const axios = require('axios')

async function testStudentLogin() {
  const baseURL = process.env.API_URL || 'http://localhost:5000/api'
  try {
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      loginType: 'student',
      fullName: 'Teacher Created Student',
      grade: '5',
      registrationCode: 'GJV8NH'
    }, { timeout: 5000 })
    const { token, user, success } = loginRes.data || {}
    console.log('LOGIN STATUS:', success, user && user.fullName, user && user.role)
    if (!token) {
      console.log('NO TOKEN RETURNED')
      return
    }
    const verifyRes = await axios.get(`${baseURL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    })
    console.log('VERIFY STATUS:', verifyRes.data?.success, verifyRes.data?.user?.role)
  } catch (err) {
    if (err.response) {
      console.log('ERROR STATUS:', err.response.status)
      console.log('ERROR BODY:', err.response.data)
    } else {
      console.log('ERROR:', err.message)
    }
  }
}

testStudentLogin()


