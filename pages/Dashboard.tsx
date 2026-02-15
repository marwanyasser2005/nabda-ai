
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplets, Zap, Wind, TrendingUp, AlertTriangle, CloudSun, BrainCircuit, ArrowRight, Activity
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { climateService } from '../services/climateService';
import { analyticsService } from '../services/analyticsService';
import { ChartContainer } from '../components/ChartContainer';

// --- WIDGET COMPONENT ---
const KPICard = ({ title, value, unit, trend, riskLevel, icon: Icon, color }: any) => (
    <div className={`bg-nabda-card border rounded-xl p-5 relative overflow-hidden ${riskLevel === 'HIGH' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-nabda-border'}`}>
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline mt-1">
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            <span className="text-xs text-slate-500 font-normal ml-1">{unit}</span>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-slate-800 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {/* Risk Indicator */}
      {riskLevel && (
        <div className={`mt-3 flex items-center text-xs font-bold px-2 py-1 rounded w-fit ${riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
           {riskLevel === 'HIGH' ? <AlertTriangle className="w-3 h-3 mr-1" /> : <Activity className="w-3 h-3 mr-1" />}
           {riskLevel} Risk
        </div>
      )}

      {/* Trend */}
      <div className="mt-2 text-xs flex items-center border-t border-slate-800 pt-2">
            <span className="text-slate-500 mr-1">Trend:</span>
            <span className={`${trend.direction === 'up' ? 'text-red-400' : 'text-green-400'} font-bold`}>
                {trend.direction === 'up' ? '↑' : '↓'} {trend.percent.toFixed(1)}%
            </span>
      </div>
    </div>
);

export const Dashboard: React.FC = () => {
  const { waterReadings, energyReadings, company, climateData } = usePlatform();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // --- ANALYTICS ENGINE EXECUTION ---
  const analysis = useMemo(() => {
    // 1. Water Analysis
    const waterTrend = analyticsService.calculateTrend(waterReadings);
    const waterNext = analyticsService.predictNextValue(waterReadings);
    const waterRisk = analyticsService.detectAnomaly(waterReadings, company?.settings.aiSensitivity || 'BALANCED');

    // 2. Energy Analysis
    const energyTrend = analyticsService.calculateTrend(energyReadings);
    const energyNext = analyticsService.predictNextValue(energyReadings);
    const energyRisk = analyticsService.detectAnomaly(energyReadings, company?.settings.aiSensitivity || 'BALANCED');
    
    // 3. Carbon Analysis
    const totalCarbon = (energyReadings.reduce((a, b) => a + b.carbonEstimate, 0) + waterReadings.reduce((a, b) => a + b.carbonEstimate, 0)) / 1000;
    const efficiencyScore = analyticsService.calculateEfficiencyScore(energyTrend.percent, waterTrend.percent, 0.45);

    return {
        water: { trend: waterTrend, next: waterNext, risk: waterRisk ? 'HIGH' : 'LOW', current: waterReadings[waterReadings.length-1]?.value || 0 },
        energy: { trend: energyTrend, next: energyNext, risk: energyRisk ? 'HIGH' : 'LOW', current: energyReadings[energyReadings.length-1]?.value || 0 },
        carbon: { total: totalCarbon, score: efficiencyScore }
    };
  }, [waterReadings, energyReadings, company]);

  // --- CLIMATE ENGINE EXECUTION ---
  const climate = useMemo(() => {
     const today = climateData.find(d => d.source === 'REALTIME') || climateData[0];
     if (!today) return null;
     const hsi = climateService.calculateHeatStressIndex(today.tempC, today.humidity);
     const risk = climateService.getOperationalRiskIndex(hsi, today.aqi, today.windSpeed);
     return { hsi, risk, data: today };
  }, [climateData]);

  if (!mounted || !climate) return null;

  return (
    <div className="space-y-6" id="executive-dashboard">
      
      {/* AI Briefing */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-nabda-border rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nabda-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
            <div className="flex items-center mb-3">
                <BrainCircuit className="w-5 h-5 text-nabda-primary mr-2" />
                <h2 className="text-white font-bold text-lg">AI Executive Briefing</h2>
                <span className="ml-auto text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600">Model: Gemini 3 Flash</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
                Analysis complete. 
                Energy consumption is <span className={analysis.energy.trend.direction === 'up' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{analysis.energy.trend.direction} by {analysis.energy.trend.percent.toFixed(1)}%</span>. 
                Infrastructure Efficiency Score is <strong>{analysis.carbon.score}/100</strong>.
                {climate.risk > 50 && <span className="text-nabda-warning block mt-1 font-bold">⚠️ High Operational Climate Risk Detected ({climate.risk}/100). Check Cooling Load.</span>}
            </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
            title="Energy Load" 
            value={analysis.energy.current.toLocaleString()} 
            unit="kWh" 
            color="text-nabda-warning" 
            icon={Zap} 
            trend={analysis.energy.trend} 
            riskLevel={analysis.energy.risk} 
        />
        <KPICard 
            title="Water Usage" 
            value={analysis.water.current.toLocaleString()} 
            unit="m3" 
            color="text-nabda-primary" 
            icon={Droplets} 
            trend={analysis.water.trend} 
            riskLevel={analysis.water.risk} 
        />
        <KPICard 
            title="Carbon Footprint" 
            value={analysis.carbon.total.toFixed(2)} 
            unit="tCO2e" 
            color="text-green-500" 
            icon={Wind} 
            trend={{percent: 2.1, direction: 'down'}} // Mock for demo
            riskLevel={analysis.carbon.score > 80 ? 'LOW' : 'HIGH'} 
        />
        <KPICard 
            title="Heat Stress Index" 
            value={climate.hsi.toFixed(1)} 
            unit="°C" 
            color="text-red-400" 
            icon={CloudSun} 
            trend={{percent: 0, direction: 'flat'}} 
            riskLevel={climate.hsi > 32 ? 'HIGH' : 'LOW'} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forecast Chart */}
        <div className="lg:col-span-2 bg-nabda-card border border-nabda-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-white font-semibold">Predictive Load Analysis</h3>
                <p className="text-xs text-slate-400">Actual vs Predicted (Linear Regression Model)</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center text-slate-400"><div className="w-2 h-2 rounded-full bg-nabda-warning mr-1"></div> Energy</span>
                <span className="flex items-center text-slate-400"><div className="w-2 h-2 rounded-full bg-nabda-primary mr-1"></div> Water</span>
            </div>
          </div>
          <ChartContainer height={300}>
              <AreaChart data={waterReadings.slice(-8).map((w, i) => ({
                name: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                water: w.value,
                energy: energyReadings[i]?.value || 0
              }))}>
                <defs>
                  <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="energy" stroke="#f59e0b" fill="url(#colorE)" strokeWidth={2} />
                <Area type="monotone" dataKey="water" stroke="#22d3ee" fill="none" strokeWidth={2} />
              </AreaChart>
          </ChartContainer>
        </div>

        {/* Action Center */}
        <div className="bg-nabda-card border border-nabda-border rounded-xl p-6 flex flex-col">
          <h3 className="text-white font-semibold mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-nabda-primary" />
              Action Protocol
          </h3>
          
          <div className="flex-1 space-y-3">
             {analysis.energy.next > analysis.energy.current * 1.1 && (
                 <div className="p-3 bg-red-900/20 border-l-2 border-red-500 rounded-r-lg">
                    <p className="text-xs font-bold text-red-400 uppercase mb-1">Predictive Alert</p>
                    <p className="text-sm text-slate-200">Energy load forecast to spike +10% next week based on trend.</p>
                 </div>
             )}
             {climate.risk > 40 && (
                 <div className="p-3 bg-yellow-900/20 border-l-2 border-yellow-500 rounded-r-lg">
                    <p className="text-xs font-bold text-yellow-400 uppercase mb-1">Climate Warning</p>
                    <p className="text-sm text-slate-200">High operational risk index. Reduce non-essential load.</p>
                 </div>
             )}
             <div className="p-3 bg-slate-800 rounded-lg">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Next Scheduled Report</p>
                 <p className="text-sm text-slate-200">Tuesday, 18:00 (Auto-Generated)</p>
             </div>
          </div>
          
          <button onClick={() => navigate('/app/reports')} className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
             View All Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};
