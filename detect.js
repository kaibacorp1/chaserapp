import { detectTransitsForUser } from './transitUtils.js';
import { sendEmail } from './emailUtils.js'; // 👈 import added

const config = {
  lat: -43.154289,
  lng: 172.738596,
  elevation: 41,
  radiusKm: 300,
  marginDeg: 100,
  mode: 'sun',
  emailTo: 'sandu.godakumbura@gmail.com',
  rapidApiKey: process.env.RAPIDAPI_KEY,
  rapidApiHost: process.env.RAPIDAPI_HOST
};

async function runDetectionLoop() {
  console.log('[🕒] Starting detection loop...');
  try {
    const results = await detectTransitsForUser(config);
    if (results.length === 0) {
      console.log('[⛅] No transits detected. Sleeping...');
    } else {
      console.log('[🚨] Detected transit events:', results);

      // ✅ Send email
      await sendEmail(config.emailTo, results);
    }
  } catch (error) {
    console.error('[❌] Error during detection:', error);
  }
}

setInterval(runDetectionLoop, 60 * 1000);
runDetectionLoop();
