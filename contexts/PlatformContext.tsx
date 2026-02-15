
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/db';
import { Company, Meter, Reading, MeterType, ClimateData, GeneratedReport, ReportType } from '../types';
import { generateExecutiveReportSummary } from '../services/geminiService';

interface PlatformContextType {
  company: Company | null;
  meters: Meter[];
  waterReadings: Reading[];
  energyReadings: Reading[];
  climateData: ClimateData[];
  reports: GeneratedReport[];
  trialDaysLeft: number;
  refreshData: () => void;
  addReading: (type: MeterType, value: number, date: string) => void;
  generateInstantReport: (type: ReportType, title: string) => Promise<void>;
  upgradePlan: (planId: 'STANDARD' | 'BUSINESS' | 'ENTERPRISE') => void;
  updateSettings: (settings: Partial<Company['settings']>) => void;
  updateProfile: (name: string, industry: any) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [waterReadings, setWaterReadings] = useState<Reading[]>([]);
  const [energyReadings, setEnergyReadings] = useState<Reading[]>([]);
  const [climateData, setClimateData] = useState<ClimateData[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  const refreshData = () => {
    db.init(); // Ensure seed
    setCompany(db.getCompany());
    setMeters(db.getMeters());
    setWaterReadings(db.getReadings(MeterType.WATER));
    setEnergyReadings(db.getReadings(MeterType.ENERGY));
    setClimateData(db.getClimateData());
    setReports(db.getReports());
    setTrialDaysLeft(db.getTrialDaysLeft());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addReading = (type: MeterType, value: number, date: string) => {
    const meter = meters.find(m => m.type === type);
    if (!meter) return;

    db.addReading({
      meterId: meter.id,
      date,
      value,
      manual: true
    });
    
    // Trigger Instant Report for the specific resource
    const reportType = type === MeterType.WATER ? ReportType.WATER_ALERT : ReportType.ENERGY_ALERT;
    generateInstantReport(reportType, `Instant ${type === MeterType.WATER ? 'Water' : 'Energy'} Analysis`);
    
    refreshData();
  };

  const generateInstantReport = async (type: ReportType, title: string) => {
     // Mock calculation of costs for the report
     const totalCost = waterReadings.reduce((a,b) => a + b.costEstimate, 0) + energyReadings.reduce((a,b) => a + b.costEstimate, 0);
     const totalCarbon = waterReadings.reduce((a,b) => a + b.carbonEstimate, 0) + energyReadings.reduce((a,b) => a + b.carbonEstimate, 0);
     
     // Use AI to generate the summary text
     const summary = await generateExecutiveReportSummary(totalCost, totalCarbon);
     
     db.addReport({
        type,
        title,
        summary,
        riskScore: Math.floor(Math.random() * 30), // Simulated risk score
     });
     setReports(db.getReports());
  };

  const upgradePlan = (planId: 'STANDARD' | 'BUSINESS' | 'ENTERPRISE') => {
      if (!company) return;
      db.updateCompany({ subscriptionPlan: planId });
      refreshData();
  };

  const updateSettings = (newSettings: Partial<Company['settings']>) => {
      if (!company) return;
      const updatedSettings = { ...company.settings, ...newSettings };
      db.updateCompany({ settings: updatedSettings });
      refreshData();
  };

  const updateProfile = (name: string, industry: any) => {
      if (!company) return;
      db.updateCompany({ name, industry });
      refreshData();
  };

  return (
    <PlatformContext.Provider value={{ 
      company, meters, waterReadings, energyReadings, climateData, reports, trialDaysLeft, 
      refreshData, addReading, generateInstantReport, upgradePlan, updateSettings, updateProfile
    }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
     throw new Error("usePlatform must be used within PlatformProvider");
  }
  return context;
};
