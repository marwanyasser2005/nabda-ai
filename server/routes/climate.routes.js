const express = require('express');
const router = express.Router();

// --- MOCK SERVICE FOR DEMO ---
// In production, replace with `axios` calls to OpenMeteo / BigDataCloud
// This ensures the frontend gets data even if we don't have the real external logic fully wired in this XML

router.get('/geocode', async (req, res) => {
  const { lat, lon } = req.query;
  // Mock Reverse Geocode
  res.json({ city: 'Industrial District 4', country: 'Egypt' });
});

router.get('/ip-location', async (req, res) => {
  // Mock IP Location
  res.json({ lat: 30.04, lon: 31.23, city: 'Cairo', country: 'EG' });
});

router.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query;
  // Return structure matching ClimateData type
  // This would usually call OpenMeteo API
  const mockData = [];
  const now = new Date();
  
  for(let i=0; i<7; i++) {
     const d = new Date(now);
     d.setDate(d.getDate() - 2 + i);
     mockData.push({
        date: d.toISOString(),
        tempC: 32 + Math.random() * 5,
        humidity: 40 + Math.random() * 20,
        windSpeed: 12,
        aqi: 65,
        pm25: 15,
        condition: i % 2 === 0 ? 'Clear Sky' : 'Haze',
        isForecast: i > 2,
        source: i === 2 ? 'REALTIME' : (i < 2 ? 'HISTORY' : 'FORECAST')
     });
  }
  
  res.json(mockData);
});

module.exports = router;