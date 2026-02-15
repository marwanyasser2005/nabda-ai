const express = require('express');
const cors = require('cors');
const path = require('path');
const aiRoutes = require('./routes/ai.routes');
const climateRoutes = require('./routes/climate.routes');

// --- APP SETUP ---
const app = express();
const PORT = process.env.PORT || 8080;

// --- MIDDLEWARE ---
app.use(cors({ origin: '*' })); // Configure for specific domain in production
app.use(express.json());

// --- ROUTES ---
app.use('/api/ai', aiRoutes);
app.use('/api/climate', climateRoutes);

// --- HEALTH CHECK (For Cloud Run) ---
app.get('/health', (req, res) => {
  res.status(200).send('NABDA AI Engine: Operational');
});

// --- SERVE STATIC FRONTEND (If bundled) ---
// In production, you might serve built React files here
// app.use(express.static(path.join(__dirname, '../dist')));

// --- START ---
app.listen(PORT, () => {
  console.log(`🚀 NABDA Cloud Core running on port ${PORT}`);
});