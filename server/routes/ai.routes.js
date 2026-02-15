
const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini.service');

router.post('/analyze', async (req, res) => {
  const { type, context } = req.body;

  // Context Extraction
  const industry = context.industry || 'Factory';
  const sensitivity = context.sensitivity || 'BALANCED';

  // Base System Prompt
  let system = `You are NABDA AI, an advanced industrial efficiency system for the ${industry} sector in Egypt.
  Your goal is to protect the user's P&L and ensure Carbon Compliance.
  
  RULES:
  1. Output must be purely JSON where specified.
  2. Use Egyptian Pounds (EGP) for currency.
  3. Reference specific data points provided.
  4. Tone: Executive, concise, financially driven.
  5. Sensitivity Level: ${sensitivity}.`;

  let prompt = "";

  switch (type) {
    case 'RESOURCE_RISK':
      prompt = `DATA:
      - Current Usage: ${context.current}
      - Historical Avg: ${context.average}
      - Trend: ${context.trend > 0 ? '+' : ''}${context.trend}%
      - Anomaly Detected: ${context.isAnomaly}
      - Predicted Next Week: ${context.prediction}
      
      TASK: Provide a JSON object with:
      - "risk_level": "LOW", "MEDIUM", or "HIGH"
      - "financial_implication": One sentence on cost impact.
      - "recommendation": One specific operational action.
      
      Output ONLY raw JSON.`;
      break;

    case 'CARBON_AUDIT':
      prompt = `DATA:
      - Total Emissions YTD: ${context.total} tCO2e
      - Carbon Intensity: ${context.intensity} kg/unit
      - Efficiency Score: ${context.score}/100
      - Target Reduction: ${context.target}%
      
      TASK: Write a 2-sentence executive summary for an ESG report. Focus on compliance status and export readiness (CBAM).`;
      break;

    case 'CLIMATE_RISK':
      prompt = `DATA:
      - Location: ${context.location}
      - Temp: ${context.temp}C
      - Heat Stress Index: ${context.hsi}
      - Cooling Load Increase: ${context.load}%
      
      TASK: Provide specific HVAC or shift-management advice to minimize the ${context.load}% cooling load spike cost. Max 25 words.`;
      break;

    case 'EXECUTIVE_SUMMARY':
      prompt = `Generate a Weekly Board Report Summary.
      - Total Cost: ${context.cost} EGP
      - Total Carbon: ${context.carbon} Tons
      - Efficiency Trend: ${context.efficiencyTrend}
      
      TASK: Write exactly two bullet points. 
      1. Financial Health (Risks/Savings).
      2. Sustainability Performance.`;
      break;

    default:
      return res.status(400).json({ error: "Invalid Type" });
  }

  try {
    const result = await geminiService.generateContent(prompt, system);
    
    // Attempt to parse JSON for risk analysis, otherwise return text
    try {
        if (type === 'RESOURCE_RISK') {
            const json = JSON.parse(result.replace(/```json/g, '').replace(/```/g, ''));
            return res.json({ result: json });
        }
    } catch (e) {
        // Fallback if model didn't output strict JSON
    }

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Engine Error", result: "Analysis temporarily unavailable." });
  }
});

module.exports = router;
