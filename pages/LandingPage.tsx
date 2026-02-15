import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, BarChart3, Globe, ChevronRight, Check } from 'lucide-react';
import { PRICING_PLANS } from '../constants';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-nabda-dark text-white font-inter">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-nabda-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <ShieldCheck className="w-8 h-8 text-nabda-primary" />
              <span className="ml-2 text-xl font-bold tracking-tighter">NABDA</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => navigate('/platform')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Platform</button>
              <button onClick={() => navigate('/app/carbon')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Carbon Intelligence</button>
              <button onClick={() => navigate('/pricing')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</button>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/app')} className="text-sm font-medium text-white hover:text-nabda-primary">
                Login
              </button>
              <button 
                onClick={() => navigate('/app')} 
                className="bg-nabda-primary hover:bg-nabda-primaryDark text-nabda-dark px-5 py-2 rounded-full text-sm font-bold transition-all"
              >
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-nabda-primary/20 via-nabda-dark to-nabda-dark pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-nabda-primary/30 bg-nabda-primary/10 text-nabda-primary text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-nabda-primary mr-2 animate-pulse"></span>
            Enterprise Resource Protection
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Stop Financial Leakage. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nabda-primary to-cyan-200">
              Automate Carbon Compliance.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10">
            The first AI-driven protection system for Egyptian factories and enterprises. 
            Prevent water waste, predict energy tariff shocks, and generate investor-ready carbon reports.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => navigate('/app')} className="bg-white text-nabda-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors flex items-center justify-center">
               Start 14-Day Free Trial <ChevronRight className="ml-2 w-5 h-5"/>
             </button>
             <button onClick={() => navigate('/platform')} className="px-8 py-4 rounded-lg font-bold text-lg border border-slate-700 hover:border-slate-500 text-white transition-colors">
               How It Works
             </button>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="features" className="py-24 bg-nabda-card/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid md:grid-cols-3 gap-12">
             <div className="p-8 rounded-2xl bg-nabda-dark border border-white/10 hover:border-nabda-primary/50 transition-colors group cursor-pointer" onClick={() => navigate('/platform')}>
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="text-blue-400 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Financial Risk AI</h3>
                <p className="text-slate-400 leading-relaxed">
                  Our algorithms analyze consumption against Egyptian tariff tiers (electricity & water) to predict bill shock before it happens.
                </p>
             </div>
             <div className="p-8 rounded-2xl bg-nabda-dark border border-white/10 hover:border-nabda-primary/50 transition-colors group cursor-pointer" onClick={() => navigate('/app/carbon')}>
                <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="text-green-400 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Carbon Intelligence</h3>
                <p className="text-slate-400 leading-relaxed">
                  Automated Scope 1 & 2 calculation aligned with international export standards (CBAM). Be ready for European exports.
                </p>
             </div>
             <div className="p-8 rounded-2xl bg-nabda-dark border border-white/10 hover:border-nabda-primary/50 transition-colors group cursor-pointer" onClick={() => navigate('/app/water')}>
                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-purple-400 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Leakage Protection</h3>
                <p className="text-slate-400 leading-relaxed">
                  Early warning system for water leaks and energy anomalies. We detect infrastructure stress signals instantly.
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-nabda-card">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2024 NABDA AI Systems. Cairo, Egypt.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
