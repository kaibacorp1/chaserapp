import fetch from 'node-fetch';
import { detectTransits } from './transitUtils.js';
import { sendEmail } from './email.js';
import { config } from './config.js';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = process.env.RAPIDAPI_HOST;

const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': API_HOST
};

async function fetchFlights() {
  const url = `https://${API_HOST}/v2/lat/${config.userLat}/lon/${config.userLon}/dist/${config.radius}/`;
  try {
    const res = await fetch(url, { headers });
    const json = await res.json();
    return json.ac || [];
  } catch (err) {
    console.error('Failed to fetch flights:', err);
    return [];
  }
}

async function mainLoop() {
  console.log(`[${new Date().toISOString()}] Starting detection loop...`);
  const flights = await fetchFlights();

  const matches = detectTransits({
    flights,
    ...config
  });

  if (matches.length > 0) {
    console.log(`✅ MATCH DETECTED: ${matches.length} aircraft`);
    await sendEmail(matches);
  } else {
    console.log('No match. Sleeping...');
  }

  setTimeout(mainLoop, config.pollInterval * 1000);
}

mainLoop();