const nodemailer = require('nodemailer');

const {
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_FROM
} = process.env;

let transporter;

function ensureTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn('[EmailService] Missing EMAIL_USER or EMAIL_PASSWORD environment variables. Email notifications are disabled.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST || 'smtp.gmail.com',
    port: Number(EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  });

  return transporter;
}

async function sendEmail({
  to,
  subject,
  text,
  html
}) {
  const emailTransporter = ensureTransporter();

  if (!emailTransporter) {
    return false;
  }

  if (!to || to.length === 0) {
    console.warn('[EmailService] Attempted to send an email without recipients.');
    return false;
  }

  try {
    const mailOptions = {
      from: EMAIL_FROM || EMAIL_USER || 'uwasevaste@gmail.com',
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      text,
      html
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('[EmailService] Error sending email:', error.message);
    return false;
  }
}

module.exports = {
  sendEmail
};

