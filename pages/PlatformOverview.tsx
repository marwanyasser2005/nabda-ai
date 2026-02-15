import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Droplets, Wind, Activity, CheckCircle, 
  ArrowRight, Layers, FileText, Cpu, Lock, Factory, Building, Store, Warehouse
} from 'lucide-react';
import { AreaChart, Area } from 'recharts';
import { ChartContainer } from '../components/ChartContainer';

// Mock Data for Visuals
const MOCK_DATA = [
  { value: 4000 }, { value: 3000 }, { value: 2000 }, { value: 2780 },
  { value: 1890 }, { value: 2390 }, { value: 3490 }
];

export const PlatformOverview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-nabda-dark text-slate-200 font-inter">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-nabda-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-to-br from-nabda-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
              <span className="ml-2 text-xl font-bold tracking-tighter text-white">NABDA</span>
            </div>
            <div className="flex items-center space-x-4">
               <button onClick={() => navigate('/app')} className="text-white hover:text-nabda-primary font-medium">Login</button>
               <button onClick={() => navigate('/pricing')} className="bg-nabda-primary text-nabda-dark px-4 py-2 rounded-lg font-bold hover:bg-nabda-primaryDark transition-colors">
                  View Pricing
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-nabda-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The Operating System for <br />
            <span className="text-nabda-primary">Resource Efficiency</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            A complete ecosystem connecting AI sensors, financial risk modeling, and automated carbon compliance into one dashboard.
          </p>
          <button onClick={() => navigate('/app')} className="bg-white text-nabda-dark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform">
            Launch Interactive Demo
          </button>
        </div>
      </section>

      {/* Interactive Widgets Section */}
      <section className="py-20 bg-nabda-card/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-white">Live Protection Engines</h2>
             <p className="text-slate-400 mt-2">See how our modules detect risk in real-time.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
             {/* Widget 1: Energy */}
             <div className="bg-nabda-dark border border-nabda-border rounded-xl p-6 hover:border-nabda-warning/50 transition-colors group cursor-pointer" onClick={() => navigate('/app/energy')}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Energy Risk</p>
                    <h3 className="text-2xl font-bold text-white mt-1">12,450 <span className="text-sm font-normal">kWh</span></h3>
                  </div>
                  <div className="bg-nabda-warning/20 p-2 rounded-lg text-nabda-warning">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <div className="h-16 mb-4">
                  <ChartContainer height={64}>
                    <AreaChart data={MOCK_DATA}>
                      <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                </div>
                <div className="flex items-center text-xs text-nabda-warning bg-nabda-warning/10 p-2 rounded">
                  <Activity className="w-3 h-3 mr-2" />
                  Tariff Jump Probability: 85%
                </div>
             </div>

             {/* Widget 2: Water */}
             <div className="bg-nabda-dark border border-nabda-border rounded-xl p-6 hover:border-nabda-primary/50 transition-colors group cursor-pointer" onClick={() => navigate('/app/water')}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Water Stability</p>
                    <h3 className="text-2xl font-bold text-white mt-1">3,200 <span className="text-sm font-normal">m3</span></h3>
                  </div>
                  <div className="bg-nabda-primary/20 p-2 rounded-lg text-nabda-primary">
                    <Droplets className="w-5 h-5" />
                  </div>
                </div>
                <div className="h-16 mb-4">
                  <ChartContainer height={64}>
                    <AreaChart data={[{value:3000}, {value:3100}, {value:3050}, {value:3200}, {value:3150}]}>
                      <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                </div>
                <div className="flex items-center text-xs text-green-400 bg-green-900/20 p-2 rounded">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Flow Rate Normal
                </div>
             </div>

             {/* Widget 3: Carbon */}
             <div className="bg-nabda-dark border border-nabda-border rounded-xl p-6 hover:border-green-500/50 transition-colors group cursor-pointer" onClick={() => navigate('/app/carbon')}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Carbon Intensity</p>
                    <h3 className="text-2xl font-bold text-white mt-1">0.42 <span className="text-sm font-normal">kg/unit</span></h3>
                  </div>
                  <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                    <Wind className="w-5 h-5" />
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
                   <div className="bg-green-500 h-full w-[70%]"></div>
                </div>
                <div className="flex items-center text-xs text-slate-300">
                  Target: 0.35 kg/unit by Q4
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Dynamic Workflow Timeline */}
      <section className="py-24 max-w-7xl mx-auto px-4">
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-6">The Weekly Protection Protocol</h2>
               <p className="text-slate-400 mb-8">
                 NABDA standardizes your facility management with a rigid, AI-assisted workflow designed to catch anomalies before they become invoices.
               </p>
               <div className="space-y-8 relative pl-8 border-l border-slate-700">
                  <div className="relative">
                     <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-nabda-dark border-2 border-nabda-warning"></span>
                     <h4 className="text-white font-bold">Sunday: Energy Audit</h4>
                     <p className="text-sm text-slate-400 mt-1">Upload meter readings. AI checks tariff tier proximity.</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-nabda-dark border-2 border-nabda-primary"></span>
                     <h4 className="text-white font-bold">Tuesday: Water & Climate</h4>
                     <p className="text-sm text-slate-400 mt-1">Input water logs. System correlates usage with heat stress index.</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-nabda-dark border-2 border-green-500"></span>
                     <h4 className="text-white font-bold">Daily: Climate Monitoring</h4>
                     <p className="text-sm text-slate-400 mt-1">Real-time heat stress and cooling load predictions.</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-nabda-primary shadow-[0_0_10px_#22d3ee]"></span>
                     <h4 className="text-white font-bold">Tuesday Evening: Executive Report</h4>
                     <p className="text-sm text-slate-400 mt-1">Automated PDF generation delivered to management.</p>
                  </div>
               </div>
            </div>
            <div className="bg-nabda-card p-8 rounded-2xl border border-white/5 shadow-2xl">
               <div className="flex items-center mb-6">
                 <FileText className="w-6 h-6 text-nabda-primary mr-3" />
                 <h3 className="text-lg font-bold text-white">Generated Report Preview</h3>
               </div>
               <div className="space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
                  <div className="h-32 bg-slate-800 rounded w-full mt-4 flex items-center justify-center border border-slate-700">
                     <span className="text-xs text-slate-500">AI Risk Analysis Chart</span>
                  </div>
               </div>
               <button className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                 Download Sample PDF
               </button>
            </div>
         </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-24 bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold text-white mb-12">Enterprise Architecture</h2>
           <div className="grid md:grid-cols-5 gap-4">
              <div className="p-6 border border-slate-700 rounded-xl bg-slate-800/50">
                 <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-400">
                    <Layers className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold text-white text-sm mb-1">OCR Engine</h4>
                 <p className="text-[10px] text-slate-400">Gemini Vision</p>
              </div>
              <div className="p-6 border border-slate-700 rounded-xl bg-slate-800/50">
                 <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-purple-400">
                    <Cpu className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold text-white text-sm mb-1">Risk Engine</h4>
                 <p className="text-[10px] text-slate-400">Tariff Logic</p>
              </div>
              <div className="p-6 border border-slate-700 rounded-xl bg-slate-800/50">
                 <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-green-400">
                    <Wind className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold text-white text-sm mb-1">Carbon Core</h4>
                 <p className="text-[10px] text-slate-400">CBAM Calc</p>
              </div>
              <div className="p-6 border border-slate-700 rounded-xl bg-slate-800/50">
                 <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-yellow-400">
                    <Zap className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold text-white text-sm mb-1">Climate AI</h4>
                 <p className="text-[10px] text-slate-400">Forecasting</p>
              </div>
              <div className="p-6 border border-slate-700 rounded-xl bg-slate-800/50">
                 <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-red-400">
                    <Lock className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold text-white text-sm mb-1">Security</h4>
                 <p className="text-[10px] text-slate-400">Isolated Data</p>
              </div>
           </div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <section className="py-24 max-w-7xl mx-auto px-4">
         <h2 className="text-3xl font-bold text-white mb-12 text-center">Tailored for Your Industry</h2>
         <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
                <Factory className="w-8 h-8 text-nabda-primary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Manufacturing</h3>
                <p className="text-sm text-slate-400 mb-4">Reduce Tariff Tier 2 exposure.</p>
                <div className="text-xs text-green-400 font-bold">Save 15% Monthly</div>
            </div>
            <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
                <Building className="w-8 h-8 text-nabda-warning mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Real Estate</h3>
                <p className="text-sm text-slate-400 mb-4">Detect underground water leaks.</p>
                <div className="text-xs text-green-400 font-bold">Prevent 50k EGP Loss</div>
            </div>
            <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
                <Store className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Commercial</h3>
                <p className="text-sm text-slate-400 mb-4">Automate multi-branch audits.</p>
                <div className="text-xs text-green-400 font-bold">Save 20hrs Admin/Mo</div>
            </div>
            <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
                <Warehouse className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">SME & Logistics</h3>
                <p className="text-sm text-slate-400 mb-4">Cooling load prediction.</p>
                <div className="text-xs text-green-400 font-bold">Optimize HVAC Cost</div>
            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center">
         <h2 className="text-3xl font-bold text-white mb-6">Ready to secure your resources?</h2>
         <button onClick={() => navigate('/pricing')} className="bg-nabda-primary text-nabda-dark px-10 py-4 rounded-full font-bold text-lg hover:bg-nabda-primaryDark transition-colors">
            View Enterprise Plans
         </button>
      </section>
    </div>
  );
};