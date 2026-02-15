import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../contexts/PlatformContext';
import { MeterType } from '../types';
import { Droplets, AlertTriangle, CheckCircle, Upload, Download, Printer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { analyzeResourceRisk } from '../services/geminiService';
import { exportService } from '../services/exportService';
import { ChartContainer } from '../components/ChartContainer';

export const WaterGuard: React.FC = () => {
  const { waterReadings, addReading, company } = usePlatform();
  const [inputVal, setInputVal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  
  // AI Guard
  const aiRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const latestReading = waterReadings[waterReadings.length - 1];
  const previousReadings = waterReadings.slice(0, -1).slice(-4);
  const avgUsage = previousReadings.reduce((sum, r) => sum + r.value, 0) / (previousReadings.length || 1);
  const deviation = latestReading ? ((latestReading.value - avgUsage) / avgUsage) * 100 : 0;
  const isAnomaly = deviation > 15;

  useEffect(() => {
    if (latestReading && previousReadings.length > 0) {
        const hash = `${latestReading.value}-${previousReadings.length}`;
        if (aiRef.current === hash) return;
        aiRef.current = hash;

        analyzeResourceRisk('WATER', latestReading.value, previousReadings.map(r => r.value))
          .then(setAiAnalysis);
    }
  }, [waterReadings, latestReading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      addReading(MeterType.WATER, Number(inputVal), new Date().toISOString());
      setInputVal('');
      setIsSubmitting(false);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white">Water Guard Engine</h1>
          <p className="text-slate-400">Leakage detection & Tariff protection</p>
        </div>
        <div className="flex gap-3 items-center">
            <div className="hidden md:block bg-blue-900/30 border border-blue-500/30 px-4 py-2 rounded-lg">
                <p className="text-xs text-blue-300 uppercase font-bold">Current Tariff</p>
                <p className="text-lg font-bold text-white">{company?.settings.waterTariff} EGP <span className="text-sm font-normal text-slate-400">/ m3</span></p>
            </div>
            
            <button 
                onClick={() => exportService.downloadCSV(waterReadings, 'Water')}
                className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-colors"
            >
                <Download className="w-4 h-4 mr-2" /> Export
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <div className="bg-nabda-card border border-nabda-border rounded-xl p-6 print:hidden">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-nabda-primary" />
            Weekly Input
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Meter Reading (m3)</label>
              <input 
                type="number" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-nabda-primary outline-none"
                placeholder="0.00"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-nabda-primary hover:bg-nabda-primaryDark text-nabda-dark font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Submit Reading'}
            </button>
          </form>
        </div>

        {/* Analytics - Fixed Height */}
        <div className="lg:col-span-2 bg-nabda-card border border-nabda-border rounded-xl p-6 flex flex-col">
           <h3 className="text-lg font-semibold text-white mb-4">Consumption Trend</h3>
           <ChartContainer height={200}>
               <AreaChart data={waterReadings.map(r => ({ date: new Date(r.date).toLocaleDateString(), value: r.value }))}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="date" stroke="#94a3b8" />
                 <YAxis stroke="#94a3b8" />
                 <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                 <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.1} />
               </AreaChart>
           </ChartContainer>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`border rounded-xl p-6 ${isAnomaly ? 'bg-red-900/20 border-red-500/50' : 'bg-green-900/20 border-green-500/50'}`}>
          <div className="flex items-start mb-2">
             {isAnomaly ? <AlertTriangle className="text-red-500 w-6 h-6 mr-2" /> : <CheckCircle className="text-green-500 w-6 h-6 mr-2" />}
             <h3 className="text-lg font-bold text-white">{isAnomaly ? 'Leakage Risk' : 'Consumption Stable'}</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Latest Usage</p>
              <p className="text-2xl font-bold text-white">{latestReading?.value.toLocaleString()} <span className="text-sm">m3</span></p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Est. Cost</p>
              <p className="text-2xl font-bold text-white">{Math.round(latestReading?.costEstimate || 0).toLocaleString()} <span className="text-sm">EGP</span></p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-nabda-border rounded-xl p-6">
           <div className="flex items-center mb-3">
             <Droplets className="text-nabda-primary w-5 h-5 mr-2" />
             <h3 className="text-white font-semibold">AI Auditor Insight</h3>
           </div>
           <p className="text-slate-300 text-sm leading-relaxed">
             {aiAnalysis || "Awaiting data..."}
           </p>
        </div>
      </div>
    </div>
  );
};