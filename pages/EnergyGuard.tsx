import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../contexts/PlatformContext';
import { MeterType } from '../types';
import { Zap, TrendingUp, DollarSign, Download, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { analyzeResourceRisk } from '../services/geminiService';
import { exportService } from '../services/exportService';
import { ChartContainer } from '../components/ChartContainer';

export const EnergyGuard: React.FC = () => {
  const { energyReadings, addReading } = usePlatform();
  const [inputVal, setInputVal] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const aiRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const latestReading = energyReadings[energyReadings.length - 1];
  const totalCost = energyReadings.reduce((sum, r) => sum + r.costEstimate, 0);
  const TIER_1_LIMIT = 1000;
  const currentUsage = latestReading?.value || 0;
  const isTier2 = currentUsage > TIER_1_LIMIT;

  useEffect(() => {
    if (latestReading && energyReadings.length > 1) {
        const hash = `${latestReading.value}-${energyReadings.length}`;
        if (aiRef.current === hash) return;
        aiRef.current = hash;

        const history = energyReadings.slice(0, -1).slice(-4).map(r => r.value);
        analyzeResourceRisk('ENERGY', latestReading.value, history).then(setAiAnalysis);
    }
  }, [energyReadings, latestReading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReading(MeterType.ENERGY, Number(inputVal), new Date().toISOString());
    setInputVal('');
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white">Energy & Tariff Guard</h1>
          <p className="text-slate-400">Bill shock prevention system</p>
        </div>
        <div className="flex gap-3 items-center">
            <div className="bg-nabda-card border border-nabda-border px-4 py-2 rounded-lg text-right hidden md:block">
                <p className="text-xs text-slate-400 uppercase">Monthly Projection</p>
                <p className="text-lg font-bold text-nabda-warning">{(totalCost * 1.1).toLocaleString()} EGP</p>
            </div>
            <button onClick={() => exportService.downloadCSV(energyReadings, 'Energy')} className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600">
                <Download className="w-4 h-4 mr-2" /> Export
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <div className="bg-nabda-card border border-nabda-border rounded-xl p-6 h-fit print:hidden">
           <h3 className="text-white font-semibold mb-4">New Reading</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="relative">
                <input 
                    type="number" 
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white"
                    placeholder="kWh value"
                    required
                />
                <Zap className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
             </div>
             <button type="submit" className="w-full bg-nabda-warning hover:bg-amber-600 text-black font-bold py-3 rounded-lg">
                Update kWh
             </button>
           </form>
           
           <div className="mt-8">
             <h4 className="text-sm font-semibold text-slate-400 mb-2">Tariff Status</h4>
             <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden relative">
                <div 
                    className={`h-full ${isTier2 ? 'bg-red-500' : 'bg-green-500'} transition-all`} 
                    style={{ width: `${Math.min(100, (currentUsage / 2000) * 100)}%` }}
                ></div>
                <div className="absolute top-0 bottom-0 w-0.5 bg-white left-1/2"></div>
             </div>
             <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0</span>
                <span>1000 (Tier Limit)</span>
                <span>2000+</span>
             </div>
           </div>
        </div>

        {/* Chart - Fixed Height */}
        <div className="lg:col-span-2 bg-nabda-card border border-nabda-border rounded-xl p-6">
           <h3 className="text-white font-semibold mb-6">Financial Impact Analysis</h3>
           <ChartContainer height={300}>
                <BarChart data={energyReadings.map(r => ({ date: new Date(r.date).toLocaleDateString(), cost: r.costEstimate }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#fff' }} />
                    <Bar dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                        {energyReadings.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.costEstimate > 1600 ? '#ef4444' : '#f59e0b'} />
                        ))}
                    </Bar>
                </BarChart>
           </ChartContainer>
           
           <div className="mt-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
             <div className="flex items-start">
                <div className="bg-nabda-warning/20 p-2 rounded-lg mr-3">
                    <DollarSign className="w-5 h-5 text-nabda-warning" />
                </div>
                <div>
                    <h4 className="text-white font-medium text-sm">AI Savings Opportunity</h4>
                    <p className="text-slate-400 text-sm mt-1">{aiAnalysis || "Analyzing..."}</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};