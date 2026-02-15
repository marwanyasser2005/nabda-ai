
import React, { useState, useEffect } from 'react';
import { usePlatform } from '../contexts/PlatformContext';
import { IndustryType } from '../types';
import { 
  Building, Sliders, Save, CheckCircle, BrainCircuit, Mail, Zap, Droplets, Calendar, Globe
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { company, updateSettings, updateProfile } = usePlatform();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'CONFIG' | 'NOTIFICATIONS'>('CONFIG');
  const [notification, setNotification] = useState<string | null>(null);

  // Form States
  const [settings, setSettings] = useState(company?.settings);
  const [industry, setIndustry] = useState(company?.industry);
  const [name, setName] = useState(company?.name);

  useEffect(() => {
    if (company) {
      setSettings(company.settings);
      setIndustry(company.industry);
      setName(company.name);
    }
  }, [company]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    if (!settings) return;
    updateSettings(settings);
    updateProfile(name || '', industry || IndustryType.FACTORY);
    showNotification("System configuration updated successfully.");
  };

  if (!settings) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Configuration</h1>
          <p className="text-slate-400">Manage tariffs, carbon factors, and AI behavior.</p>
        </div>
        {notification && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg flex items-center animate-fade-in">
                <CheckCircle className="w-4 h-4 mr-2" />
                {notification}
            </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 space-y-2">
             <button 
                onClick={() => setActiveTab('CONFIG')} 
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'CONFIG' ? 'bg-nabda-primary/10 text-nabda-primary border border-nabda-primary/30' : 'text-slate-400 hover:bg-slate-800'}`}
             >
                <Sliders className="w-4 h-4 mr-3" /> Operational Config
             </button>
             <button 
                onClick={() => setActiveTab('PROFILE')} 
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'PROFILE' ? 'bg-nabda-primary/10 text-nabda-primary border border-nabda-primary/30' : 'text-slate-400 hover:bg-slate-800'}`}
             >
                <Building className="w-4 h-4 mr-3" /> Company Profile
             </button>
             <button 
                onClick={() => setActiveTab('NOTIFICATIONS')} 
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'NOTIFICATIONS' ? 'bg-nabda-primary/10 text-nabda-primary border border-nabda-primary/30' : 'text-slate-400 hover:bg-slate-800'}`}
             >
                <Mail className="w-4 h-4 mr-3" /> Reports & Alerts
             </button>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
              <div className="bg-nabda-card border border-nabda-border rounded-xl p-8">
                  
                  {activeTab === 'CONFIG' && (
                      <div className="space-y-8">
                          <div>
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                  <Zap className="w-5 h-5 mr-2 text-nabda-warning" /> Tariff & Energy
                              </h3>
                              <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">Electricity Tariff Model</label>
                                      <select 
                                          value={settings.energyTariffType}
                                          onChange={(e) => setSettings({...settings, energyTariffType: e.target.value as any})}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                                      >
                                          <option value="TIERED">Egyptian Standard Tiered (Auto)</option>
                                          <option value="FLAT">Flat Rate (Industrial Special)</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">Water Rate (EGP/m3)</label>
                                      <input 
                                          type="number"
                                          value={settings.waterTariff}
                                          onChange={(e) => setSettings({...settings, waterTariff: Number(e.target.value)})}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                                      />
                                  </div>
                              </div>
                          </div>

                          <div className="border-t border-slate-700 pt-6">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                  <Globe className="w-5 h-5 mr-2 text-green-400" /> Carbon Factors (Scope 1 & 2)
                              </h3>
                              <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">Grid Factor (kgCO2e/kWh)</label>
                                      <input 
                                          type="number" step="0.001"
                                          value={settings.carbonFactorEnergy}
                                          onChange={(e) => setSettings({...settings, carbonFactorEnergy: Number(e.target.value)})}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                                      />
                                      <p className="text-xs text-slate-500 mt-1">Default: 0.457 (Egypt 2024 Avg)</p>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">Water Factor (kgCO2e/m3)</label>
                                      <input 
                                          type="number" step="0.01"
                                          value={settings.carbonFactorWater}
                                          onChange={(e) => setSettings({...settings, carbonFactorWater: Number(e.target.value)})}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                                      />
                                  </div>
                              </div>
                          </div>

                          <div className="border-t border-slate-700 pt-6">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                  <BrainCircuit className="w-5 h-5 mr-2 text-purple-400" /> AI Intelligence
                              </h3>
                              <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">Risk Sensitivity</label>
                                      <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                                          {['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'].map((opt) => (
                                              <button
                                                  key={opt}
                                                  onClick={() => setSettings({...settings, aiSensitivity: opt as any})}
                                                  className={`flex-1 text-xs font-bold py-2 rounded ${settings.aiSensitivity === opt ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                              >
                                                  {opt}
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">Climate/AQI Alert Level</label>
                                      <select 
                                          value={settings.aqiSensitivity}
                                          onChange={(e) => setSettings({...settings, aqiSensitivity: e.target.value as any})}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                                      >
                                          <option value="LOW">Standard Operations (Alert > 150 AQI)</option>
                                          <option value="HIGH">Sensitive Equipment (Alert > 100 AQI)</option>
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'PROFILE' && (
                       <div className="space-y-6">
                           <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Company Registered Name</label>
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                                />
                           </div>
                           <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Industry Sector</label>
                                <select 
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value as IndustryType)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                                >
                                    <option value="FACTORY">Manufacturing & Factory</option>
                                    <option value="REAL_ESTATE">Real Estate / Facility</option>
                                    <option value="ENTERPRISE">Enterprise HQ</option>
                                    <option value="SME">SME / Commercial</option>
                                </select>
                           </div>
                       </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end">
                      <button onClick={handleSave} className="flex items-center px-6 py-3 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition-colors">
                          <Save className="w-5 h-5 mr-2" /> Save Configuration
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
