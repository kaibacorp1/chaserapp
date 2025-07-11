import fetch from 'node-fetch';
import SunCalc from 'suncalc';

export async function detectTransitsForUser(config) {
  const {
    lat,
    lng,
    elevation,
    radiusKm,
    marginDeg,
    mode
  } = config;

  // Call ADS-B Exchange API to get nearby aircraft
  const url = `https://${process.env.RAPIDAPI_HOST}/v2/lat/${lat}/lon/${lng}/dist/${radiusKm}/`;

  const response = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();

  const now = new Date();
  const sunPos = SunCalc.getPosition(now, lat, lng);
  const sunAz = radToDeg(sunPos.azimuth) + 180; // Azimuth is from -π to π, convert to 0–360°
  const sunEl = radToDeg(sunPos.altitude);

  const matches = data.ac
    .filter(ac => ac.lat && ac.lon && ac.alt_baro)
    .map(ac => {
      const az = calculateAzimuth(lat, lng, ac.lat, ac.lon);
      const el = calculateElevation(lat, lng, elevation, ac.lat, ac.lon, ac.alt_baro);
      const distance = calculateDistance(lat, lng, ac.lat, ac.lon);

      const azDiff = Math.abs(sunAz - az);
      const elDiff = Math.abs(sunEl - el);

      const isMatch = azDiff <= marginDeg && elDiff <= marginDeg;

      return isMatch
        ? {
            flight: ac.flight || ac.hex || 'UNKNOWN',
            lat: ac.lat,
            lng: ac.lon,
            time: now.toISOString(),
            transit: { el, az, alt: ac.alt_baro, distance },
            matchedBy: 'sun'
          }
        : null;
    })
    .filter(Boolean);

  return matches;
}


function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

// Haversine distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Calculate azimuth from observer to target
function calculateAzimuth(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  return (radToDeg(brng) + 360) % 360;
}

// Calculate elevation angle from observer to aircraft
function calculateElevation(lat1, lon1, elev1, lat2, lon2, alt2) {
  const groundDistance = calculateDistance(lat1, lon1, lat2, lon2) * 1000; // in meters
  const deltaAlt = alt2 - elev1;
  return radToDeg(Math.atan2(deltaAlt, groundDistance));
}
