// Content Filtering by Grade - Ensures age-appropriate content
// Grades 1-3: Easy content only
// Grades 4-6: Harder content (grades 4-6)
export const getContentByGrade = (content, userGrade) => {
  if (!userGrade || !content || !Array.isArray(content)) {
    console.log('[ContentFilter] No grade or content provided, returning all content');
    return content || []
  }

  // Normalize grade format
  const gradeNum = parseInt(userGrade.toString().replace('Grade ', '').trim()) || 0
  console.log('[ContentFilter] Filtering content for grade:', userGrade, '| Grade number:', gradeNum)

  // Grade 1-3: Only show EASY content (grades 1-3)
  if (gradeNum >= 1 && gradeNum <= 3) {
    const filtered = content.filter(item => {
      const itemGrade = item.gradeLevel || item.grade || item.difficulty
      const itemGradeNum = parseInt(itemGrade?.toString().replace('Grade ', '').trim() || '0') || 0
      
      // Show content only if:
      // 1. Content has no grade specified (assume it's easy), OR
      // 2. Content is marked for grades 1-3 (easy content)
      if (itemGradeNum === 0) {
        // No grade specified - assume it's appropriate for younger kids
        return true
      }
      
      // Only show content for grades 1-3
      const isEasyContent = itemGradeNum >= 1 && itemGradeNum <= 3
      
      if (isEasyContent) {
        // Simplify content titles and descriptions for younger kids
        if (item.title && typeof item.title === 'string') {
          item.title = simplifyText(item.title)
        }
        if (item.description && typeof item.description === 'string') {
          item.description = simplifyText(item.description)
        }
      }
      
      return isEasyContent
    })
    console.log('[ContentFilter] Grades 1-3: Filtered', content.length, 'items to', filtered.length, 'easy items')
    return filtered
  }

  // Grade 4-6: Show harder content (grades 4-6)
  if (gradeNum >= 4 && gradeNum <= 6) {
    const filtered = content.filter(item => {
      const itemGrade = item.gradeLevel || item.grade || item.difficulty
      const itemGradeNum = parseInt(itemGrade?.toString().replace('Grade ', '').trim() || '0') || 0
      
      // Show content if:
      // 1. Content has no grade specified (assume it's appropriate), OR
      // 2. Content is for grades 4-6 (harder content)
      if (itemGradeNum === 0) {
        // No grade specified - assume it's appropriate
        return true
      }
      
      // Show content for grades 4-6
      return itemGradeNum >= 4 && itemGradeNum <= 6
    })
    console.log('[ContentFilter] Grades 4-6: Filtered', content.length, 'items to', filtered.length, 'harder items')
    return filtered
  }

  // Grade 7+: All content
  console.log('[ContentFilter] Grade 7+: Returning all', content.length, 'items')
  return content
}

// Simplify text for younger grades
const simplifyText = (text) => {
  if (!text) return text
  
  // Replace complex words with simpler ones
  const replacements = {
    'interactive': 'fun',
    'educational': 'learning',
    'comprehensive': 'complete',
    'challenging': 'fun',
    'advanced': 'harder',
    'beginner': 'easy',
    'intermediate': 'medium'
  }

  let simplified = text
  Object.keys(replacements).forEach(complex => {
    const regex = new RegExp(complex, 'gi')
    simplified = simplified.replace(regex, replacements[complex])
  })

  return simplified
}

// Get difficulty level for grade
export const getDifficultyForGrade = (grade) => {
  const gradeNum = parseInt(grade?.toString().replace('Grade ', '') || '0') || 0

  if (gradeNum >= 1 && gradeNum <= 3) {
    return 'easy'
  } else if (gradeNum >= 4 && gradeNum <= 6) {
    return 'medium'
  } else {
    return 'hard'
  }
}

// Check if content is appropriate for grade
export const isContentAppropriate = (content, userGrade) => {
  if (!userGrade || !content) return true

  const gradeNum = parseInt(userGrade.toString().replace('Grade ', '').trim() || '0') || 0
  const contentGrade = content.gradeLevel || content.grade || content.difficulty
  const contentGradeNum = parseInt(contentGrade?.toString().replace('Grade ', '').trim() || '0') || 0

  // Content without grade is always appropriate
  if (contentGradeNum === 0) return true

  // For grades 1-3, only show easy content (grades 1-3)
  if (gradeNum >= 1 && gradeNum <= 3) {
    return contentGradeNum >= 1 && contentGradeNum <= 3
  }

  // For grades 4-6, show harder content (grades 4-6)
  if (gradeNum >= 4 && gradeNum <= 6) {
    return contentGradeNum >= 4 && contentGradeNum <= 6
  }

  // For other grades, show content up to their grade level
  return contentGradeNum <= gradeNum
}

export default {
  getContentByGrade,
  getDifficultyForGrade,
  isContentAppropriate
}

