const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email send error:', error.message);
    throw error;
  }
};

const sendOTPEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: 'Your BikeService OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #111; color: #fff; padding: 30px; border-radius: 12px;">
        <h2 style="color: #E53935; margin-bottom: 10px;">BikeService OTP</h2>
        <p style="font-size: 16px;">Your one-time password is:</p>
        <div style="background: #222; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 36px; font-weight: bold; color: #E53935; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #aaa; font-size: 13px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendOTPEmail };
