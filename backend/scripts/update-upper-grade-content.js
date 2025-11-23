// Insert the new Grade 4-6 games without wiping the database
const { GamifiedContent, sequelize } = require('../models')
const sampleGamifiedContent = require('../seeders/gamifiedContentData')

const NEW_TITLES = new Set([
  'Volcano Adventure Lab',
  'Comic Strip Creator',
  'Eco Rangers Mission',
  'STEM Drone Challenge',
  'Kigali Innovation Fair',
  'Mystery Math Escape Room',
  'Robotics Logic Lab',
  'Space Colony Planner',
  'African History Time Travelers',
  'Imigongo Puzzle Studio',
  'Lake Kivu Puzzle Quest',
  'Logic Circuit Challenge'
])

async function insertNewUpperGradeGames() {
  try {
    const newEntries = sampleGamifiedContent.filter(item => NEW_TITLES.has(item.title))

    for (const entry of newEntries) {
      const [record, created] = await GamifiedContent.findOrCreate({
        where: { title: entry.title },
        defaults: entry
      })

      if (created) {
        console.log(`✅ Added: ${entry.title}`)
      } else {
        await record.update(entry)
        console.log(`🔄 Updated existing game: ${entry.title}`)
      }
    }

    console.log('🎉 Upper-grade games refreshed successfully!')
  } catch (error) {
    console.error('❌ Failed to insert upper-grade games:', error)
  } finally {
    await sequelize.close()
  }
}

insertNewUpperGradeGames()


