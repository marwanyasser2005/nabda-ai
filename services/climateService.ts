
import { ClimateData } from '../types';

export const climateService = {
  // NOAA / Rothfusz Regression Formula for Heat Index
  calculateHeatStressIndex: (tempC: number, humidity: number): number => {
    const T = (tempC * 9/5) + 32; // Convert to F
    const RH = humidity;

    let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094));

    if (HI >= 80) {
      HI = -42.379 + 2.04901523 * T + 10.14333127 * RH - .22475541 * T * RH - .00683783 * T * T - .05481717 * RH * RH + .00122874 * T * T * RH + .00085282 * T * RH * RH - .00000199 * T * T * RH * RH;
      if (RH < 13 && T > 80 && T < 112) {
        const adjustment = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95.)) / 17);
        HI -= adjustment;
      } else if (RH > 85 && T > 80 && T < 87) {
        const adjustment = ((RH - 85) / 10) * ((87 - T) / 5);
        HI += adjustment;
      }
    }
    return (HI - 32) * 5/9; // Convert back to C
  },

  getCoolingLoadPrediction: (forecastTemp: number, baseTemp: number = 24): number => {
    if (forecastTemp <= baseTemp) return 0;
    const diff = forecastTemp - baseTemp;
    // +4.5% load for every degree above base
    return parseFloat((diff * 4.5).toFixed(1)); 
  },

  calculatePredictedCostIncrease: (coolingLoadIncreasePct: number, currentDailyEnergyCost: number): number => {
    // Assuming HVAC is ~40% of total load in an industrial facility
    const coolingPortion = currentDailyEnergyCost * 0.40;
    const addedCost = coolingPortion * (coolingLoadIncreasePct / 100);
    return Math.round(addedCost);
  },

  getRiskLevel: (hsi: number): 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' => {
    if (hsi < 27) return 'LOW';
    if (hsi < 32) return 'MODERATE';
    if (hsi < 41) return 'HIGH';
    return 'EXTREME';
  },

  getOperationalRiskIndex: (hsi: number, aqi: number, windSpeed: number): number => {
    // 0-100 Score
    // HSI (Heat) - 50% weight
    // AQI (Air) - 30% weight
    // Wind - 20% weight (High wind can disrupt operations)
    
    const hsiScore = Math.min(100, Math.max(0, (hsi - 20) * 3));
    const aqiScore = Math.min(100, Math.max(0, aqi / 3));
    const windScore = Math.min(100, windSpeed * 2);

    return Math.round((hsiScore * 0.5) + (aqiScore * 0.3) + (windScore * 0.2));
  }
};
