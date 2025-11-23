/*
  Quick DB inspector for DigLearners (SQLite via Sequelize)
  Usage: node scripts/inspect-db.js
*/

const path = require('path')

async function main() {
  // Ensure we load the same Sequelize instance/config as the app
  const models = require(path.join(__dirname, '..', 'models'))
  const {
    sequelize,
    User,
    Lesson,
    LearningClass,
    ClassLesson,
    Progress,
    Badge,
    UserBadge,
    UserLearningClass,
  } = models

  const out = {}
  const safeFindAll = async (model, options = {}) => {
    try {
      return await model.findAll(options)
    } catch (err) {
      return { error: err.message }
    }
  }

  const safeCount = async (model) => {
    try {
      return await model.count()
    } catch (err) {
      return { error: err.message }
    }
  }

  try {
    await sequelize.authenticate()
  } catch (err) {
    console.error('DB connection failed:', err.message)
    process.exit(1)
  }

  // Summary counts
  out.counts = {
    users: await safeCount(User),
    lessons: await safeCount(Lesson),
    classes: await safeCount(LearningClass),
    classLessons: await safeCount(ClassLesson),
    progress: await safeCount(Progress),
    badges: await safeCount(Badge),
    userBadges: await safeCount(UserBadge),
    userLearningClasses: await safeCount(UserLearningClass),
  }

  // Sample records
  const sampleLimit = 5
  out.samples = {}

  const userAttrs = ['id', 'fullName', 'email', 'role', 'grade', 'registrationCode', 'createdAt']
  out.samples.users = await safeFindAll(User, { attributes: userAttrs, limit: sampleLimit, order: [['createdAt', 'DESC']] })

  const classAttrs = ['id', 'name', 'description', 'createdAt']
  out.samples.classes = await safeFindAll(LearningClass, { attributes: classAttrs, limit: sampleLimit, order: [['createdAt', 'DESC']] })

  const lessonAttrs = ['id', 'title', 'subject', 'grade', 'ageGroup', 'createdAt']
  out.samples.lessons = await safeFindAll(Lesson, { attributes: lessonAttrs, limit: sampleLimit, order: [['createdAt', 'DESC']] })

  const progressAttrs = ['id', 'userId', 'lessonId', 'status', 'score', 'createdAt']
  out.samples.progress = await safeFindAll(Progress, { attributes: progressAttrs, limit: sampleLimit, order: [['createdAt', 'DESC']] })

  const badgeAttrs = ['id', 'name', 'description', 'createdAt']
  out.samples.badges = await safeFindAll(Badge, { attributes: badgeAttrs, limit: sampleLimit, order: [['createdAt', 'DESC']] })

  const userBadgeAttrs = ['id', 'userId', 'badgeId', 'createdAt']
  out.samples.userBadges = await safeFindAll(UserBadge, { attributes: userBadgeAttrs, limit: sampleLimit, order: [['createdAt', 'DESC']] })

  const ulcAttrs = ['id', 'userId', 'learningClassId', 'createdAt']
  out.samples.userLearningClasses = await safeFindAll(UserLearningClass, { attributes: ulcAttrs, limit: sampleLimit, order: [['createdAt', 'DESC']] })

  // Pretty print
  const replacer = (key, value) => {
    if (value && typeof value.toJSON === 'function') {
      return value.toJSON()
    }
    return value
  }

  console.log(JSON.stringify(out, replacer, 2))

  await sequelize.close()
}

main().catch((err) => {
  console.error('Inspector error:', err)
  process.exit(1)
})


