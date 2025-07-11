export const config = {
  userLat: 40.7128,         // Your latitude
  userLon: -74.0060,        // Your longitude
  userElev: 0,              // Elevation in meters
  bodyAz: 180,              // Sun/moon azimuth
  bodyAlt: 45,              // Sun/moon altitude
  margin: 2.5,              // Detection margin (degrees)
  predictSeconds: 30,       // How far ahead to predict (seconds)
  selectedBody: 'moon',     // 'moon', 'sun', or 'plane on plane'
  use3DHeading: true,
  useZenithLogic: true,
  enhancedPrediction: true,
  radius: 50,               // Search radius (km)
  pollInterval: 60          // How often to poll (seconds)
};