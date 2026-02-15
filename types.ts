
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER'
}

export enum IndustryType {
  ENTERPRISE = 'ENTERPRISE',
  REAL_ESTATE = 'REAL_ESTATE',
  FACTORY = 'FACTORY',
  SME = 'SME'
}

export enum MeterType {
  WATER = 'WATER',
  ENERGY = 'ENERGY'
}

export enum ReportType {
  WATER_ALERT = 'WATER_ALERT',
  ENERGY_ALERT = 'ENERGY_ALERT',
  CARBON_AUDIT = 'CARBON_AUDIT',
  CLIMATE_RISK = 'CLIMATE_RISK',
  WEEKLY_EXECUTIVE = 'WEEKLY_EXECUTIVE'
}

export interface TariffTier {
  limit: number; // Upper limit of tier
  rate: number; // EGP per unit
}

export interface Reading {
  id: string;
  meterId: string;
  date: string; // ISO Date
  value: number;
  imageUrl?: string; // For OCR
  manual: boolean;
  costEstimate: number;
  carbonEstimate: number; // kgCO2e
}

export interface Meter {
  id: string;
  companyId: string;
  name: string;
  type: MeterType;
  unit: string;
}

export interface CompanySettings {
  waterTariff: number; // Flat rate EGP/m3
  energyTariffType: 'FLAT' | 'TIERED';
  carbonFactorEnergy: number; // kgCO2e/kWh (Default 0.457 for Egypt)
  carbonFactorWater: number; // kgCO2e/m3 (Default 0.3)
  tempThreshold: number; // Degrees C to trigger alerts
  aqiSensitivity: 'LOW' | 'HIGH';
  aiSensitivity: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'; 
  reportingEmail: string; 
  currency: string; 
  weeklyReportDay: number; // 0-6 (Sun-Sat)
}

export interface Company {
  id: string;
  name: string;
  industry: IndustryType;
  trialStartDate: string; // ISO Date
  subscriptionPlan: 'TRIAL' | 'STANDARD' | 'BUSINESS' | 'ENTERPRISE';
  settings: CompanySettings;
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  role: UserRole;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceEGP: number;
  features: string[];
  recommended?: boolean;
}

// --- NEW DOMAIN MODELS ---

export interface GeoLocation {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

export interface ClimateData {
  date: string; // ISO Date
  tempC: number;
  humidity: number;
  windSpeed: number;
  aqi: number; // 1-5 Scale usually, mapped to 0-500
  pm25: number;
  condition: string;
  description?: string;
  isForecast: boolean;
  source: 'REALTIME' | 'HISTORY' | 'FORECAST';
}

export interface GeneratedReport {
  id: string;
  type: ReportType;
  generatedAt: string;
  title: string;
  summary: string;
  riskScore: number;
  status: 'READY' | 'PROCESSING';
  downloadUrl?: string;
}

// --- ANALYTICS MODELS ---

export interface AnalyticsResult {
  currentValue: number;
  average: number;
  trendPercentage: number;
  isAnomaly: boolean;
  predictedNext: number;
  efficiencyScore: number;
}

export interface CarbonMetrics {
  totalEmissions: number; // tCO2e
  intensity: number; // kgCO2e per unit
  complianceScore: number; // 0-100
  projectedAnnual: number;
}
