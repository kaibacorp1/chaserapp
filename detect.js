import dotenv from 'dotenv';
dotenv.config();

import { sendEmail } from './email.js';

console.log('[🧪] Running FAKE detection test...');

const fakeResult = {
  flight: 'FAKE123',
  lat: process.env.LAT,
  lng: process.env.LNG,
  altitude: 35000,
  heading: 270,
  time: new Date().toISOString(),
  matchedBy: 'test-simulated'
};

sendEmail([fakeResult])
  .then(() => {
    console.log('[✅] Test email sent successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('[❌] Failed to send test email:', err);
    process.exit(1);
  });
