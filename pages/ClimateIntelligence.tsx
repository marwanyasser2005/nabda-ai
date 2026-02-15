import React, { useEffect, useState, useMemo, useRef } from 'react';
import { usePlatform } from '../contexts/PlatformContext';
import { CloudSun, Sun, Thermometer, Wind, AlertTriangle, MapPin, Loader2, Image } from 'lucide-react';
import { analyzeClimateImpact } from '../services/geminiService';
import { climateService } from '../services/climateService';
import { weatherService } from '../services/weatherService';
import { exportService } from '../services/exportService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ClimateData, GeoLocation } from '../types';
import { ChartContainer } from '../components/ChartContainer';

export const ClimateIntelligence: React.FC = () => {
  const [climateTimeline, setClimateTimeline] = useState<ClimateData[]>([]);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // AI Guard: Ensure we only call AI once per session/location change
  const aiCalledRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    const init = async () => {
      try {
        const loc = await weatherService.getCurrentPosition();
        if (!isSubscribed) return;
        setLocation(loc);

        const data = await weatherService.fetchClimateData(loc);
        if (!isSubscribed) return;
        setClimateTimeline(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    init();
    return () => { isSubscribed = false; };
  }, []);

  // Compute Metrics
  const todayMetrics = useMemo(() => {
    if (!climateTimeline.length) return null;
    const today = climateTimeline.find(d => d.source === 'REALTIME') || climateTimeline[0];
    if (!today) return null;

    return {
      today,
      hsi: climateService.calculateHeatStressIndex(today.tempC, today.humidity),
      coolingLoad: climateService.getCoolingLoadPrediction(today.tempC),
      costImpact: climateService.calculatePredictedCostIncrease(climateService.getCoolingLoadPrediction(today.tempC), 1600)
    };
  }, [climateTimeline]);

  // AI Effect with Guard
  useEffect(() => {
    if (!todayMetrics || !location) return;
    
    const cacheKey = `${location.city}-${todayMetrics.today.date}`;
    if (aiCalledRef.current === cacheKey) return; // Prevent loop

    aiCalledRef.current = cacheKey; // Lock

    analyzeClimateImpact({
      temp: todayMetrics.today.tempC,
      hsi: todayMetrics.hsi,
      location: location.city
    }).then(res => {
      if (res) setAiInsight(res);
    });
  }, [todayMetrics, location]);

  const handleExport = async () => {
    setIsExporting(true);
    await exportService.exportReportAsImage('climate-dashboard', 'Climate_Risk_Report');
    setIsExporting(false);
  };

  if (!mounted) return null; // Prevent hydration error

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-nabda-primary" />
        <p>Connecting to Satellite Feeds...</p>
      </div>
    );
  }

  if (!todayMetrics) {
    return (
      <div className="p-8 text-center border border-slate-700 rounded-xl bg-slate-800">
        <p className="text-slate-400">Weather data unavailable. Please refresh.</p>
      </div>
    );
  }

  const { today, hsi, coolingLoad, costImpact } = todayMetrics;

  return (
    <div className="space-y-6" id="climate-dashboard">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              Climate & Air Engine
              <span className="ml-3 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 animate-pulse">LIVE</span>
            </h1>
            <div className="flex items-center text-slate-400 mt-1 text-sm">
                <MapPin className="w-4 h-4 mr-1 text-nabda-primary" />
                {location?.city}, {location?.country}
            </div>
         </div>
         <div className="flex gap-3">
             <div className="flex items-center bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                 <Thermometer className="w-5 h-5 text-nabda-warning mr-2" />
                 <div>
                    <span className="text-xl font-bold text-white">{today.tempC.toFixed(1)}°C</span>
                    <p className="text-[10px] text-slate-500 uppercase">Current</p>
                 </div>
             </div>
             <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-nabda-primary hover:bg-nabda-primaryDark text-nabda-dark font-bold rounded-lg transition-colors"
             >
                <Image className="w-4 h-4 mr-2" /> {isExporting ? 'Exporting...' : 'Export'}
             </button>
         </div>
       </div>

       {/* Timeline */}
       <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex gap-4 min-w-[800px]">
              {climateTimeline.map((day, idx) => (
                  <div key={idx} className={`flex-1 p-4 rounded-xl border-2 ${day.source === 'REALTIME' ? 'border-nabda-primary bg-slate-800' : 'border-slate-700 bg-nabda-card'} flex flex-col items-center text-center`}>
                      <p className="text-xs uppercase font-bold text-slate-500 mb-2">
                         {new Date(day.date).toLocaleDateString(undefined, {weekday: 'short'})}
                      </p>
                      {day.condition.includes('Clear') ? <Sun className="w-8 h-8 text-yellow-500 mb-2" /> : <CloudSun className="w-8 h-8 text-slate-400 mb-2" />}
                      <p className="text-2xl font-bold text-white">{Math.round(day.tempC)}°C</p>
                      <div className="w-full mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                         <div><span className="block text-blue-300">{day.humidity}%</span>Hum</div>
                         <div><span className="block text-green-400">{day.aqi}</span>AQI</div>
                      </div>
                  </div>
              ))}
          </div>
       </div>

       {/* Main Chart Section with FIX for Recharts */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-nabda-card border border-nabda-border rounded-xl p-6">
              <h3 className="text-white font-semibold mb-6">Temperature & Risk Trend</h3>
              <ChartContainer height={250}>
                    <AreaChart data={climateTimeline}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tickFormatter={(t) => new Date(t).toLocaleDateString(undefined, {weekday: 'short'})} />
                        <YAxis stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Area type="monotone" dataKey="tempC" stroke="#ef4444" fill="url(#colorTemp)" strokeWidth={3} />
                    </AreaChart>
              </ChartContainer>
           </div>

           {/* Metrics */}
           <div className="space-y-4">
              <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-400 font-bold uppercase">Cooling Load</span>
                      <span className="text-xl font-bold text-nabda-warning">+{coolingLoad}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-nabda-warning" style={{width: `${Math.min(100, coolingLoad)}%`}}></div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-700 flex justify-between">
                      <span className="text-xs text-slate-300">Cost Impact</span>
                      <span className="text-sm font-bold text-red-400">+{costImpact} EGP</span>
                  </div>
              </div>

              <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-l-4 border-nabda-warning p-6 rounded-r-xl">
                   <div className="flex items-center mb-3">
                       <AlertTriangle className="w-5 h-5 text-nabda-warning mr-3" />
                       <h3 className="text-white font-bold">AI Strategy</h3>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed">
                       {aiInsight || "Analysis pending..."}
                   </p>
              </div>
           </div>
       </div>
    </div>
  );
};