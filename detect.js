import dotenv from 'dotenv';
dotenv.config();

import { detectTransits } from './transitUtils.js';
import { sendEmail } from './email.js';

console.log(`[🕒] Starting detection loop...`);

async function runDetectionLoop() {
  while (true) {
    try {
      const results = await detectTransits();

      if (results.length > 0) {
        console.log(`✅ MATCH DETECTED: ${results.length} result(s)`);
        await sendEmail(results);
      } else {
        console.log(`[📭] No match. Sleeping...`);
      }
    } catch (err) {
      console.error(`[❌] Error during detection:`, err);
    }

    // Wait 2 minutes before next check
    await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));
  }
}

runDetectionLoop();
