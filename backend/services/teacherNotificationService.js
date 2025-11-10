const { User, UserLearningClass, LearningClass } = require('../models');
const { sendEmail } = require('./emailService');

async function getTeacherRecipientsForStudent(studentId) {
  const classMemberships = await UserLearningClass.findAll({
    where: { userId: studentId, isActive: true },
    include: [
      {
        model: LearningClass,
        as: 'learningClass',
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'fullName', 'email']
          }
        ]
      }
    ]
  });

  const teacherMap = new Map();

  classMemberships.forEach((membership) => {
    const teacher = membership?.learningClass?.teacher;
    if (teacher?.email) {
      teacherMap.set(teacher.email, teacher);
    }
  });

  // Fallback: if the student is not linked to any class, notify all teachers
  if (teacherMap.size === 0) {
    const teachers = await User.findAll({
      where: { role: 'teacher' },
      attributes: ['id', 'fullName', 'email']
    });

    teachers.forEach((teacher) => {
      if (teacher.email) {
        teacherMap.set(teacher.email, teacher);
      }
    });
  }

  return Array.from(teacherMap.values());
}

function buildEmailContent({ student, activityType, title, score, points, badges }) {
  const subject = `[DigLearners] ${student.fullName} completed ${title}`;

  const badgeLines = (badges || [])
    .map((badge) => `• ${badge.name} (${badge.points} pts)`)
    .join('\n');

  const textLines = [
    `Hello Teacher,`,
    '',
    `${student.fullName} just completed ${activityType} "${title}".`,
    score !== undefined ? `Score: ${score}` : '',
    points ? `Points awarded: ${points}` : '',
    badgeLines ? `Badges earned:\n${badgeLines}` : '',
    '',
    'Keep up the great work guiding your class!',
    '',
    '— DigLearners Team'
  ].filter(Boolean);

  const htmlLines = [
    `<p>Hello Teacher,</p>`,
    `<p><strong>${student.fullName}</strong> just completed ${activityType} "<strong>${title}</strong>".</p>`,
    score !== undefined ? `<p>Score: <strong>${score}</strong></p>` : '',
    points ? `<p>Points awarded: <strong>${points}</strong></p>` : '',
    badgeLines
      ? `<p>Badges earned:</p><ul>${(badges || [])
          .map((badge) => `<li>${badge.name} (${badge.points} pts)</li>`)
          .join('')}</ul>`
      : '',
    `<p>Keep up the great work guiding your class!</p>`,
    `<p>— DigLearners Team</p>`
  ].filter(Boolean);

  return {
    subject,
    text: textLines.join('\n'),
    html: htmlLines.join('')
  };
}

async function notifyTeachersOfStudentActivity({
  studentId,
  activityType,
  title,
  score,
  points,
  badges = []
}) {
  try {
    const student = await User.findByPk(studentId, {
      attributes: ['id', 'fullName', 'email']
    });

    if (!student) {
      console.warn('[TeacherNotificationService] Student not found for notification.');
      return;
    }

    const recipients = await getTeacherRecipientsForStudent(studentId);
    if (!recipients || recipients.length === 0) {
      console.warn('[TeacherNotificationService] No teacher recipients resolved for notification.');
      return;
    }

    const { subject, text, html } = buildEmailContent({
      student,
      activityType,
      title,
      score,
      points,
      badges
    });

    await sendEmail({
      to: recipients.map((teacher) => teacher.email),
      subject,
      text,
      html
    });
  } catch (error) {
    console.error('[TeacherNotificationService] Error sending notification:', error);
  }
}

module.exports = {
  notifyTeachersOfStudentActivity
};

