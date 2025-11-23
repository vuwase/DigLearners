const baseURL = process.env.API_URL || 'http://localhost:5000/api'

async function teacherLogin() {
  const res = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      loginType: 'teacher',
      email: 'testteacher@diglearners.com',
      password: 'password123'
    })
  })

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  if (!data.token) {
    throw new Error(`No token returned: ${JSON.stringify(data)}`)
  }

  return data.token
}

async function fetchGradeContent(token, grade = 'Grade 6') {
  const res = await fetch(`${baseURL}/gamified/grade/${encodeURIComponent(grade)}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    throw new Error(`Content request failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  const games = data?.data || []
  console.log(`Grade ${grade} content count:`, games.length)
  games.forEach((game, index) => {
    console.log(`  ${index + 1}. ${game.title} (${game.gameType}) - ${game.difficulty}`)
  })
}

async function run() {
  try {
    const token = await teacherLogin()
    await fetchGradeContent(token, 'Grade 6')
    await fetchGradeContent(token, 'Grade 5')
  } catch (error) {
    console.error('❌', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
  }
}

run()


