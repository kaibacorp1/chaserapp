import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendEmail(matches) {
  const message = matches.map(m => `✈️ ${m.callsign} at ${m.azimuth}°, elev ${m.altitudeAngle}°, ${m.distance}m away`).join('<br>');

  const mailOptions = {
    from: `Transit Chaser <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: '🚨 Transit Match Detected',
    html: `<h2>Transit Detected</h2><p>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📬 Email sent');
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}