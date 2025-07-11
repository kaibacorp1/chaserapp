import { detectTransitsForUser } from './transitUtils.js';

const config = {
  lat: -43.154289,
  lng: 172.738596,
  elevation: 41,
  radiusKm: 100,
  marginDeg: 100,
  mode: 'sun',
  emailTo: 'youremail@example.com'
};

async function runDetectionLoop() {
  console.log('[🕒] Starting detection loop...');
  try {
    const results = await detectTransitsForUser(config);
    if (results.length === 0) {
      console.log('[⛅] No transits detected. Sleeping...');
    } else {
      console.log('[🚨] Detected transit events:', results);
    }
  } catch (error) {
    console.error('[❌] Error during detection:', error);
  }
}

// 🔁 Keep checking every 60 seconds
setInterval(runDetectionLoop, 60 * 1000);

// Run immediately once
runDetectionLoop();
