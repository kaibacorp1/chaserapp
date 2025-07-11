// emailUtils.js
import nodemailer from 'nodemailer';

export async function sendEmail(to, matches) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const htmlBody = matches.map(m => `
    <p>
      <strong>Flight:</strong> ${m.flight}<br>
      <strong>Time:</strong> ${m.time}<br>
      <strong>Lat/Lng:</strong> ${m.lat}, ${m.lng}<br>
      <strong>Elevation:</strong> ${m.transit.el.toFixed(1)}°, 
      <strong>Azimuth:</strong> ${m.transit.az.toFixed(1)}°, 
      <strong>Altitude:</strong> ${m.transit.alt} ft, 
      <strong>Distance:</strong> ${m.transit.distance.toFixed(1)} km
    </p>
  `).join('<hr>');

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: '✈️ Transit Match Detected',
    html: htmlBody
  });

  console.log(`[📧] Email sent to ${to}`);
}
