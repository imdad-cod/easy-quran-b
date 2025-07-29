// server/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',        // 🔐 آپ کا Gmail
    pass: 'your_app_password_here'       // ⚠️ App Password (Gmail settings سے)
  }
});

function sendRegistrationEmail(user) {
  const mailOptions = {
    from: '"Quran Learn Easy" <your_email@gmail.com>',
    to: 'your_email@gmail.com', // یا admin کی email
    subject: '📩 New User Registration',
    html: `
      <h2>New User Registered</h2>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Country:</strong> ${user.country}</p>
      <p><strong>City:</strong> ${user.city}</p>
      <p><strong>Course:</strong> ${user.course}</p>
      <p><strong>Role:</strong> ${user.role}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('❌ Email error:', error);
    }
    console.log('✅ Email sent:', info.response);
  });
}

module.exports = { sendRegistrationEmail };
