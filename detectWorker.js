import { detectTransitsForUser } from './transitUtils.js';
import { sendEmail } from './email.js';

export async function runUserDetection(config) {
  console.log(`🛰️ Starting detection for: ${config.email}`);

  const loop = async () => {
    try {
      const matches = await detectTransitsForUser(config);

      if (matches.length > 0) {
        console.log(`📡 Match found for ${config.email}`);
        await sendEmail(matches, config.email);
      } else {
        console.log(`⏳ No match for ${config.email}. Sleeping...`);
      }
    } catch (err) {
      console.error(`❌ Error for ${config.email}:`, err.message);
    }

    setTimeout(loop, 2 * 60 * 1000); // 2 min
  };

  loop();
}
