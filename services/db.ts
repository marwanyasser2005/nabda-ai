
import { Company, Meter, Reading, MeterType, IndustryType, User, UserRole, GeneratedReport, ReportType, ClimateData } from '../types';

const STORAGE_KEYS = {
  COMPANY: 'nabda_prod_company_v2',
  USER: 'nabda_prod_user_v2',
  METERS: 'nabda_prod_meters_v2',
  READINGS: 'nabda_prod_readings_v2',
  REPORTS: 'nabda_prod_reports_v2',
  CLIMATE: 'nabda_prod_climate_v2'
};

// --- PRODUCTION SEED DATA ---
const SEED_COMPANY: Company = {
  id: 'comp_mansoura_01',
  name: 'Delta Food Industries',
  industry: IndustryType.FACTORY,
  trialStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  subscriptionPlan: 'TRIAL',
  settings: {
    waterTariff: 25.5, 
    energyTariffType: 'TIERED',
    carbonFactorEnergy: 0.457, // Egypt Grid 2024
    carbonFactorWater: 0.3, 
    tempThreshold: 35,
    aqiSensitivity: 'HIGH',
    aiSensitivity: 'BALANCED',
    reportingEmail: 'manager@deltafoods.com',
    currency: 'EGP',
    weeklyReportDay: 2 // Tuesday
  }
};

const SEED_USER: User = {
  id: 'usr_manager_01',
  name: 'Eng. Hassan Mahmoud',
  email: 'hassan@deltafoods.com',
  companyId: 'comp_mansoura_01',
  role: UserRole.MANAGER
};

const SEED_METERS: Meter[] = [
  { id: 'mtr_w_1', companyId: 'comp_mansoura_01', name: 'Processing Line Water', type: MeterType.WATER, unit: 'm3' },
  { id: 'mtr_e_1', companyId: 'comp_mansoura_01', name: 'Main HVAC Energy', type: MeterType.ENERGY, unit: 'kWh' }
];

// Generate 12 Weeks of History (Quarterly View)
const NOW = new Date();
const SEED_READINGS: Reading[] = [];

for (let i = 12; i >= 1; i--) {
  const date = new Date(NOW.getTime() - i * 7 * 86400000).toISOString();
  
  // Seasonal Flux: Hotter weeks = more energy/water
  const seasonalFactor = 1 + (Math.sin(i/4) * 0.1); 

  // Water: ~3500 avg
  const waterVal = Math.floor((3500 * seasonalFactor) + (Math.random() * 200 - 100));
  SEED_READINGS.push({
    id: `r_w_${i}`,
    meterId: 'mtr_w_1',
    date,
    value: waterVal,
    manual: true,
    costEstimate: waterVal * 25.5,
    carbonEstimate: waterVal * 0.3
  });

  // Energy: ~11000 avg
  const energyVal = Math.floor((11000 * seasonalFactor) + (Math.random() * 500 - 250));
  // Tiered Calc (Simple approximation for seed)
  const energyCost = (1000 * 1.6) + ((energyVal - 1000) * 1.9); 
  
  SEED_READINGS.push({
    id: `r_e_${i}`,
    meterId: 'mtr_e_1',
    date,
    value: energyVal,
    manual: true,
    costEstimate: energyCost,
    carbonEstimate: energyVal * 0.457
  });
}

// Generate Mock Climate Data
const SEED_CLIMATE: ClimateData[] = [];
for (let i = 0; i < 7; i++) {
  const d = new Date(NOW);
  d.setDate(d.getDate() - 2 + i);
  SEED_CLIMATE.push({
    date: d.toISOString(),
    tempC: 32 + Math.random() * 5,
    humidity: 40 + Math.random() * 20,
    windSpeed: 12,
    aqi: 65 + Math.floor(Math.random() * 30),
    pm25: 15,
    condition: i % 2 === 0 ? 'Clear Sky' : 'Haze',
    isForecast: i > 2,
    source: i === 2 ? 'REALTIME' : (i < 2 ? 'HISTORY' : 'FORECAST')
  });
}

export const db = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.COMPANY)) {
      console.log("📦 Initializing Production Database Schema...");
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(SEED_COMPANY));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(SEED_USER));
      localStorage.setItem(STORAGE_KEYS.METERS, JSON.stringify(SEED_METERS));
      localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(SEED_READINGS));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CLIMATE, JSON.stringify(SEED_CLIMATE));
    }
    // Ensure climate exists if not present (migration for existing users)
    if (!localStorage.getItem(STORAGE_KEYS.CLIMATE)) {
       localStorage.setItem(STORAGE_KEYS.CLIMATE, JSON.stringify(SEED_CLIMATE));
    }
  },

  getCompany: (): Company => {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY);
    return data ? JSON.parse(data) : SEED_COMPANY;
  },

  updateCompany: (updates: Partial<Company> | Partial<Company['settings']>) => {
    const current = db.getCompany();
    // Deep merge settings if present
    if ('settings' in updates) {
       updates.settings = { ...current.settings, ...updates.settings };
    }
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(updated));
    return updated;
  },
  
  getReadings: (meterType?: MeterType): Reading[] => {
    const readings: Reading[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.READINGS) || '[]');
    if (!meterType) return readings;
    
    const meters = db.getMeters(meterType);
    const meterIds = meters.map(m => m.id);
    return readings.filter(r => meterIds.includes(r.meterId)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  getMeters: (type?: MeterType): Meter[] => {
    const meters: Meter[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.METERS) || '[]');
    return type ? meters.filter(m => m.type === type) : meters;
  },

  getReports: (): GeneratedReport[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]').sort((a: GeneratedReport, b: GeneratedReport) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
  },

  getClimateData: (): ClimateData[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIMATE);
    return data ? JSON.parse(data) : SEED_CLIMATE;
  },

  addReport: (report: Omit<GeneratedReport, 'id' | 'generatedAt' | 'status'>) => {
    const reports = db.getReports();
    const newReport: GeneratedReport = {
      ...report,
      id: `rep_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      status: 'READY'
    };
    reports.unshift(newReport); 
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return newReport;
  },

  addReading: (reading: Omit<Reading, 'id' | 'costEstimate' | 'carbonEstimate'>) => {
    const readings = db.getReadings();
    const company = db.getCompany();
    
    let cost = 0;
    let carbon = 0;
    const meter = db.getMeters().find(m => m.id === reading.meterId);
    
    if (meter?.type === MeterType.WATER) {
      cost = reading.value * company.settings.waterTariff;
      carbon = reading.value * company.settings.carbonFactorWater;
    } else if (meter?.type === MeterType.ENERGY) {
       // Precise Tiered Calculation
       if (reading.value <= 1000) {
         cost = reading.value * 1.6;
       } else {
         cost = (1000 * 1.6) + ((reading.value - 1000) * 1.9);
       }
       carbon = reading.value * company.settings.carbonFactorEnergy;
    }

    const newReading: Reading = {
      ...reading,
      id: `r_${Date.now()}`,
      costEstimate: cost,
      carbonEstimate: carbon
    };

    readings.push(newReading);
    localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(readings));
    return newReading;
  },

  getTrialDaysLeft: (): number => {
    const company = db.getCompany();
    if (company.subscriptionPlan !== 'TRIAL') return -1;
    const start = new Date(company.trialStartDate).getTime();
    const now = new Date().getTime();
    const daysPassed = (now - start) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(14 - daysPassed));
  }
};
