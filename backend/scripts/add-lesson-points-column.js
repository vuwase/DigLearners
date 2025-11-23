// Script to add points_reward and badge_reward columns to lessons table
const { DataTypes } = require('sequelize')
const { sequelize } = require('../models')

async function addLessonRewardColumns() {
  const queryInterface = sequelize.getQueryInterface()
  const tableName = 'lessons'

  try {
    const tableDefinition = await queryInterface.describeTable(tableName)

    if (!tableDefinition.points_reward) {
      console.log('➕ Adding points_reward column to lessons table...')
      await queryInterface.addColumn(tableName, 'points_reward', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
      })
      console.log('✅ points_reward column added.')
    } else {
      console.log('ℹ️ points_reward column already exists. Skipping...')
    }

    if (!tableDefinition.badge_reward) {
      console.log('➕ Adding badge_reward column to lessons table...')
      await queryInterface.addColumn(tableName, 'badge_reward', {
        type: DataTypes.STRING(100),
        allowNull: true
      })
      console.log('✅ badge_reward column added.')
    } else {
      console.log('ℹ️ badge_reward column already exists. Skipping...')
    }

    console.log('🎉 Lesson rewards columns are up to date.')
  } catch (error) {
    console.error('❌ Failed to update lessons table:', error)
  } finally {
    await sequelize.close()
  }
}

addLessonRewardColumns()


