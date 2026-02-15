import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRICING_PLANS } from '../constants';
import { Check, ShieldCheck, Calculator, ArrowRight, Zap, Droplets } from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  // Safe access to context, in case user is not logged in (public view)
  let trialDays = -1;
  let upgradePlan = (id: string) => console.log('Simulate upgrade', id);
  
  try {
     const platform = usePlatform();
     trialDays = platform.trialDaysLeft;
     upgradePlan = platform.upgradePlan;
  } catch (e) {
     // Not logged in, that's fine for pricing page
  }

  // ROI Calculator State
  const [elecBill, setElecBill] = useState(50000); // Default monthly EGP
  const [waterBill, setWaterBill] = useState(15000); // Default monthly EGP
  
  // Conservative savings assumptions
  const ENERGY_SAVINGS_PCT = 0.12; 
  const WATER_SAVINGS_PCT = 0.18;
  
  const annualElecSavings = (elecBill * 12) * ENERGY_SAVINGS_PCT;
  const annualWaterSavings = (waterBill * 12) * WATER_SAVINGS_PCT;
  const totalAnnualSavings = annualElecSavings + annualWaterSavings;
  
  const businessPlanCost = 15000;
  const roiPercent = ((totalAnnualSavings - businessPlanCost) / businessPlanCost) * 100;

  const handlePlanSelect = (planId: string) => {
     if (trialDays === -1) {
         // Not logged in
         navigate('/app');
     } else {
         // Logged in
         if (confirm(`Confirm upgrade to ${planId} plan? This will be billed annually.`)) {
             upgradePlan(planId as any);
             navigate('/app');
         }
     }
  };

  return (
    <div className="min-h-screen bg-nabda-dark text-slate-200 font-inter">
      {/* Nav */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-nabda-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
               <ShieldCheck className="w-8 h-8 text-nabda-primary" />
               <span className="ml-2 text-xl font-bold text-white">NABDA</span>
            </div>
            <button onClick={() => navigate('/app')} className="text-white hover:text-nabda-primary font-bold">
               {trialDays >= 0 ? 'Back to Dashboard' : 'Login'}
            </button>
          </div>
        </div>
      </nav>

      {/* Trial Banner */}
      {trialDays >= 0 && (
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 py-3 text-center border-b border-white/10">
              <p className="text-sm text-white">
                  <span className="font-bold text-yellow-400 mr-2">Trial Active:</span> 
                  You have {trialDays} days remaining. Upgrade now to keep your data.
              </p>
          </div>
      )}

      {/* ROI Calculator Section */}
      <section className="py-16 bg-nabda-card/30 border-b border-white/5">
         <div className="max-w-6xl mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div>
                    <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
                        <Calculator className="w-8 h-8 text-nabda-primary mr-3" />
                        ROI Calculator
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Estimate your potential savings based on our historical performance with Egyptian industrial clients.
                    </p>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                                <Zap className="w-4 h-4 mr-2 text-nabda-warning" /> 
                                Avg. Monthly Electricity Bill (EGP)
                            </label>
                            <input 
                                type="number" 
                                value={elecBill}
                                onChange={(e) => setElecBill(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-nabda-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                                <Droplets className="w-4 h-4 mr-2 text-nabda-primary" /> 
                                Avg. Monthly Water Bill (EGP)
                            </label>
                            <input 
                                type="number" 
                                value={waterBill}
                                onChange={(e) => setWaterBill(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-nabda-primary outline-none"
                            />
                        </div>
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-nabda-primary/30 shadow-xl">
                     <p className="text-sm text-slate-400 uppercase font-bold mb-2">Estimated Annual Savings</p>
                     <div className="text-5xl font-bold text-white mb-6">
                         {Math.round(totalAnnualSavings).toLocaleString()} <span className="text-lg text-slate-500 font-normal">EGP</span>
                     </div>
                     
                     <div className="space-y-4 border-t border-slate-700 pt-6">
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-300">Investment (Business Plan):</span>
                             <span className="text-white font-medium">{businessPlanCost.toLocaleString()} EGP</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-300">Net Profit:</span>
                             <span className="text-green-400 font-bold">{(totalAnnualSavings - businessPlanCost).toLocaleString()} EGP</span>
                         </div>
                         <div className="flex justify-between items-center bg-green-900/20 p-3 rounded-lg border border-green-500/30">
                             <span className="text-green-400 font-bold">Return on Investment</span>
                             <span className="text-2xl font-bold text-green-400">{Math.round(roiPercent)}%</span>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
         <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">Choose Your Protection Level</h1>
            <p className="text-slate-400">All plans include the 14-day free trial. No credit card required to start.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan) => (
                <div key={plan.id} className={`relative flex flex-col p-8 rounded-2xl border transition-all hover:scale-105 ${plan.recommended ? 'border-nabda-primary bg-slate-800 shadow-2xl shadow-nabda-primary/10' : 'border-slate-700 bg-nabda-card'}`}>
                    {plan.recommended && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-nabda-primary text-nabda-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            Best Value
                        </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-6">
                        <span className="text-4xl font-bold text-white">{plan.priceEGP.toLocaleString()}</span>
                        <span className="text-slate-400 text-sm"> EGP / year</span>
                    </div>

                    <div className="flex-1">
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start text-sm text-slate-300">
                                    <Check className="w-5 h-5 text-nabda-primary mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <button 
                        onClick={() => handlePlanSelect(plan.id)}
                        className={`w-full py-4 rounded-lg font-bold transition-colors ${plan.recommended ? 'bg-nabda-primary text-nabda-dark hover:bg-nabda-primaryDark' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    >
                        {trialDays >= 0 ? 'Upgrade Now' : 'Start Free Trial'}
                    </button>
                    
                    <p className="text-xs text-center text-slate-500 mt-4">
                        {plan.id === 'standard' ? 'Good for single sites.' : plan.id === 'business' ? 'Ideal for factories.' : 'For multi-site corporations.'}
                    </p>
                </div>
            ))}
         </div>
      </section>

      {/* Feature Gating Explanation */}
      <section className="py-16 bg-slate-900 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
              <h3 className="text-lg font-bold text-white mb-8">Plan Comparison & Limits</h3>
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-slate-700">
                              <th className="py-4 text-slate-400 font-normal">Feature</th>
                              <th className="py-4 text-white font-bold text-center">Standard</th>
                              <th className="py-4 text-nabda-primary font-bold text-center">Business</th>
                              <th className="py-4 text-white font-bold text-center">Enterprise</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm text-slate-300">
                          <tr className="border-b border-slate-800">
                              <td className="py-4">Data History</td>
                              <td className="py-4 text-center">3 Months</td>
                              <td className="py-4 text-center">Unlimited</td>
                              <td className="py-4 text-center">Unlimited</td>
                          </tr>
                          <tr className="border-b border-slate-800">
                              <td className="py-4">Carbon Simulation</td>
                              <td className="py-4 text-center text-slate-600">Basic</td>
                              <td className="py-4 text-center">Advanced</td>
                              <td className="py-4 text-center">Advanced + AI</td>
                          </tr>
                          <tr className="border-b border-slate-800">
                              <td className="py-4">Export Format</td>
                              <td className="py-4 text-center">PDF Only</td>
                              <td className="py-4 text-center">PDF & CSV</td>
                              <td className="py-4 text-center">API Access</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </section>
    </div>
  );
};