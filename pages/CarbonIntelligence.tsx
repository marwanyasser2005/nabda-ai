import React, { useEffect, useState, useMemo, useRef } from 'react';
import { usePlatform } from '../contexts/PlatformContext';
import { Wind, Image, Target, DollarSign, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { analyzeCarbonFootprint } from '../services/geminiService';
import { exportService } from '../services/exportService';
import { ChartContainer } from '../components/ChartContainer';

export const CarbonIntelligence: React.FC = () => {
  const { waterReadings, energyReadings } = usePlatform();
  const [insight, setInsight] = useState("AI Analyst is reviewing your carbon data...");
  const [reductionTarget, setReductionTarget] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // AI Guard
  const lastAnalyzedRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics = useMemo(() => {
    const totalWaterCarbon = waterReadings.reduce((sum, r) => sum + r.carbonEstimate, 0);
    const totalEnergyCarbon = energyReadings.reduce((sum, r) => sum + r.carbonEstimate, 0);
    const totalCarbonYTD = totalWaterCarbon + totalEnergyCarbon;
    
    // Rolling 4-Week Avg
    const last4Energy = energyReadings.slice(-4);
    const last4Water = waterReadings.slice(-4);
    const avgEnergyCarbon = last4Energy.reduce((s,r) => s + r.carbonEstimate, 0) / (last4Energy.length || 1);
    const avgWaterCarbon = last4Water.reduce((s,r) => s + r.carbonEstimate, 0) / (last4Water.length || 1);
    const rollingAvg = avgEnergyCarbon + avgWaterCarbon;

    // Efficiency Score
    const currentWeekTotal = (last4Energy[last4Energy.length-1]?.carbonEstimate || 0) + (last4Water[last4Water.length-1]?.carbonEstimate || 0);
    const variance = rollingAvg ? Math.abs((currentWeekTotal - rollingAvg) / rollingAvg) : 0;
    const efficiencyScore = Math.max(0, Math.min(100, 100 - (variance * 100)));

    const weeks = Math.max(1, energyReadings.length);
    const annualProjection = (totalCarbonYTD / weeks) * 52;

    return { totalCarbonYTD, efficiencyScore, annualProjection };
  }, [waterReadings, energyReadings]);

  // Simulation
  const simulation = useMemo(() => {
     const savedCarbon = metrics.annualProjection * (reductionTarget / 100);
     const savedCost = savedCarbon * 2.5; 
     const newScore = Math.min(100, metrics.efficiencyScore + (reductionTarget / 2));
     return { savedCarbon, savedCost, newScore };
  }, [metrics, reductionTarget]);

  // Chart Data
  const trendData = waterReadings.slice(-8).map((w, i) => ({
    name: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    actual: (w.carbonEstimate + (energyReadings[i]?.carbonEstimate || 0)).toFixed(0),
    target: ((w.carbonEstimate + (energyReadings[i]?.carbonEstimate || 0)) * (1 - reductionTarget/100)).toFixed(0)
  }));

  // AI Effect
  useEffect(() => {
    if (metrics.totalCarbonYTD > 0) {
      const lastW = waterReadings[waterReadings.length-1]?.value || 0;
      const lastE = energyReadings[energyReadings.length-1]?.value || 0;
      
      const hash = `${lastW}-${lastE}-${metrics.efficiencyScore.toFixed(0)}`;
      if (lastAnalyzedRef.current === hash) return;
      lastAnalyzedRef.current = hash;

      analyzeCarbonFootprint(lastW, lastE, metrics.efficiencyScore).then(setInsight);
    }
  }, [waterReadings, energyReadings, metrics.efficiencyScore]);

  const handleExportImage = async () => {
      setIsProcessing(true);
      await exportService.exportReportAsImage('carbon-dashboard', 'Carbon_Intelligence_Report');
      setIsProcessing(false);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6" id="carbon-dashboard">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Carbon Intelligence</h1>
          <p className="text-slate-400">Scope 1 & 2 Analytics</p>
        </div>
        <button 
             onClick={handleExportImage}
             disabled={isProcessing}
             className="flex items-center px-4 py-2 bg-nabda-primary hover:bg-nabda-primaryDark text-nabda-dark font-bold rounded-lg transition-colors"
           >
             <Image className="w-4 h-4 mr-2" /> {isProcessing ? 'Generating...' : 'Export Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* KPI Cards */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
               <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Footprint (YTD)</p>
               <h2 className="text-3xl font-bold text-white">{(metrics.totalCarbonYTD / 1000).toFixed(2)} <span className="text-sm font-normal text-slate-500">tCO2e</span></h2>
               <div className="mt-4 flex items-center text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded w-fit">
                   <TrendingDown className="w-3 h-3 mr-1" />
                   On track
               </div>
            </div>
            
            <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
               <p className="text-slate-400 text-xs font-bold uppercase mb-2">Efficiency Score</p>
               <h2 className={`text-3xl font-bold ${metrics.efficiencyScore > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{metrics.efficiencyScore.toFixed(0)}<span className="text-lg text-slate-500">/100</span></h2>
               <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden">
                   <div className={`h-full ${metrics.efficiencyScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${metrics.efficiencyScore}%`}}></div>
               </div>
            </div>
         </div>

         {/* Chart - Fixed Height */}
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
               <h3 className="text-white font-semibold mb-4">Emissions Trend vs Target</h3>
               <ChartContainer height={250}>
                    <AreaChart data={trendData}>
                       <defs>
                          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                       <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                       <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                       <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                       <Area type="monotone" dataKey="actual" stroke="#f59e0b" fill="url(#colorActual)" strokeWidth={2} name="Actual" />
                       <Area type="monotone" dataKey="target" stroke="#22d3ee" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                    </AreaChart>
               </ChartContainer>
            </div>

            <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Reduction Simulator</h3>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-slate-400">Target Reduction</label>
                        <span className="text-xl font-bold text-nabda-primary">{reductionTarget}%</span>
                    </div>
                    <input 
                        type="range" min="5" max="20" step="1"
                        value={reductionTarget}
                        onChange={(e) => setReductionTarget(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-nabda-primary"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <div className="flex items-center text-green-400 mb-1">
                            <Wind className="w-4 h-4 mr-2" />
                            <span className="font-bold">{(simulation.savedCarbon / 1000).toFixed(1)} t</span>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase">CO2e Saved</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <div className="flex items-center text-nabda-warning mb-1">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span className="font-bold">{Math.round(simulation.savedCost).toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase">EGP Saved</p>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* AI Narrative */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center mb-3">
             <div className="p-2 bg-nabda-primary/20 rounded-lg mr-3">
                <Wind className="w-5 h-5 text-nabda-primary" />
             </div>
             <div>
                <h3 className="text-white font-bold">AI Strategic Advisory</h3>
                <p className="text-xs text-slate-400">Generated by Gemini 3 Flash • ISO 14064 Compliant</p>
             </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-nabda-primary pl-4">
             {insight}
          </p>
      </div>
    </div>
  );
};