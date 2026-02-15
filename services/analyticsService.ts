
import { Reading } from '../types';

export const analyticsService = {
  
  // 1. SIMPLE LINEAR REGRESSION FOR PREDICTION
  predictNextValue: (readings: Reading[]): number => {
    if (readings.length < 2) return readings[0]?.value || 0;
    
    // Use last 8 points max for recent trend relevance
    const data = readings.slice(-8);
    const n = data.length;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    data.forEach((r, i) => {
      sumX += i;
      sumY += r.value;
      sumXY += i * r.value;
      sumXX += i * i;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predict next index (n)
    const prediction = slope * n + intercept;
    return Math.max(0, prediction); // No negative consumption
  },

  // 2. TREND ANALYSIS
  calculateTrend: (readings: Reading[]): { percent: number; direction: 'up' | 'down' | 'flat' } => {
    if (readings.length < 2) return { percent: 0, direction: 'flat' };
    
    const current = readings[readings.length - 1].value;
    const previous = readings[readings.length - 2].value;
    
    if (previous === 0) return { percent: 100, direction: 'up' };
    
    const diff = current - previous;
    const percent = (diff / previous) * 100;
    
    return {
      percent: Math.abs(percent),
      direction: percent > 0.5 ? 'up' : percent < -0.5 ? 'down' : 'flat'
    };
  },

  // 3. ANOMALY DETECTION (Z-Score Simplified)
  detectAnomaly: (readings: Reading[], sensitivity: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'): boolean => {
    if (readings.length < 4) return false;
    
    const recent = readings.slice(-4); // Last month context
    const values = recent.map(r => r.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    const current = readings[readings.length - 1].value;
    const zScore = Math.abs((current - mean) / (stdDev || 1));
    
    const threshold = sensitivity === 'AGGRESSIVE' ? 1.0 : sensitivity === 'BALANCED' ? 1.5 : 2.0;
    
    return zScore > threshold;
  },

  // 4. EFFICIENCY SCORING
  calculateEfficiencyScore: (energyTrend: number, waterTrend: number, carbonIntensity: number): number => {
    // Base score 100
    let score = 100;
    
    // Penalize rising trends
    if (energyTrend > 0) score -= (energyTrend * 1.5);
    if (waterTrend > 0) score -= (waterTrend * 1.2);
    
    // Penalize high carbon intensity (arbitrary baseline > 0.5 kg/unit is bad)
    if (carbonIntensity > 0.5) score -= 10;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
};
