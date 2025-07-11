import dotenv from 'dotenv';
dotenv.config();

import { sendEmail } from './email.js';

console.log('[🧪] Running FAKE detection test...');

const fakeResult = {
  flight: 'FAKE123',
  lat: parseFloat(process.env.LAT),
  lng: parseFloat(process.env.LNG),
  altitude: 35000,
  heading: 270,
  time: new Date().toISOString(),
  transit: {
    alt: 400,
    az: 220,
    el: 80,
    distance: 85
  },
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
