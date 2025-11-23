/*
  Reset all users and related associations (Progress, UserBadges, UserLearningClasses)
  Usage: node scripts/reset-users.js
*/

const path = require('path')

async function main() {
  const models = require(path.join(__dirname, '..', 'models'))
  const {
    sequelize,
    User,
    Progress,
    UserBadge,
    UserLearningClass,
  } = models

  try {
    await sequelize.authenticate()

    await sequelize.transaction(async (t) => {
      // Delete child/association tables first to satisfy FKs
      await Progress.destroy({ where: {}, truncate: false, transaction: t })
      await UserBadge.destroy({ where: {}, truncate: false, transaction: t })
      await UserLearningClass.destroy({ where: {}, truncate: false, transaction: t })

      // Delete users
      await User.destroy({ where: {}, truncate: false, transaction: t })
    })

    const remaining = await User.count()
    console.log(`All users deleted. Remaining users: ${remaining}`)
  } catch (err) {
    console.error('Reset users failed:', err.message)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

main()


