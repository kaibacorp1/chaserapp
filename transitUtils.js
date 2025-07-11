import fetch from 'node-fetch';

export async function detectTransitsForUser(config) {
  const {
    lat,
    lng,
    elevation,
    radiusKm,
    marginDeg,
    mode
  } = config;

  // Call RapidAPI with this config
  const url = `https://${process.env.RAPIDAPI_HOST}/v2/lat/${lat}/lon/${lng}/dist/${radiusKm}/`;

  const response = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  });

  const data = await response.json();

  // Dummy logic — replace with your real filter
  const matches = data.ac.filter(ac => {
    return Math.random() < 0.1; // Simulate match 10% of the time
  });

  return matches.map(ac => ({
    flight: ac.flight,
    lat: ac.lat,
    lng: ac.lon,
    time: new Date().toISOString(),
    transit: {
      el: 85,
      az: 220,
      alt: 400,
      distance: 85
    },
    matchedBy: 'simulation'
  }));
}
