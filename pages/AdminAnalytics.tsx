import React from 'react';
import { Users, DollarSign, Activity, TrendingUp, Shield, AlertCircle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { ChartContainer } from '../components/ChartContainer';

export const AdminAnalytics: React.FC = () => {
  // Mock Data for Admin View
  const stats = [
    { title: 'Active Companies', value: '142', sub: '+12 this month', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Monthly Recurring Revenue', value: '2.4M EGP', sub: '98% collection rate', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Total Carbon Saved', value: '8,420 t', sub: 'across 140 factories', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Trial Conversions', value: '68%', sub: 'Avg 11 days to convert', icon: TrendingUp, color: 'text-nabda-primary', bg: 'bg-nabda-primary/10' },
  ];

  const recentActivity = [
    { company: 'Cairo Steel Works', action: 'Upgraded to Enterprise Plan', date: '2 mins ago', status: 'success' },
    { company: 'Nile Textiles', action: 'Uploaded Weekly Water Data', date: '15 mins ago', status: 'neutral' },
    { company: 'Delta Foods', action: 'Failed Payment (Retry Scheduled)', date: '1 hour ago', status: 'danger' },
    { company: 'Alexandria Cement', action: 'Exported CBAM Carbon Report', date: '3 hours ago', status: 'neutral' },
  ];

  const mrrData = [
    { month: 'Jan', mrr: 1.2 },
    { month: 'Feb', mrr: 1.5 },
    { month: 'Mar', mrr: 1.8 },
    { month: 'Apr', mrr: 2.1 },
    { month: 'May', mrr: 2.4 },
    { month: 'Jun', mrr: 2.8 },
  ];

  const riskDistData = [
    { name: 'Low Risk', count: 85 },
    { name: 'Med Risk', count: 40 },
    { name: 'High Risk', count: 17 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-nabda-border">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Analytics</h1>
          <p className="text-slate-400">Platform Performance & Revenue</p>
        </div>
        <div className="px-3 py-1 bg-nabda-primary/10 border border-nabda-primary/30 rounded-full text-nabda-primary text-xs font-bold uppercase">
          Super Admin View
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-nabda-card border border-nabda-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-nabda-card border border-nabda-border rounded-xl p-6">
          <h3 className="text-white font-semibold mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Revenue Growth (Million EGP)
          </h3>
          <ChartContainer height={300}>
              <AreaChart data={mrrData}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="mrr" stroke="#10b981" fill="url(#colorMrr)" strokeWidth={3} />
              </AreaChart>
          </ChartContainer>
        </div>

        <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Live Activity Feed</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
                <Activity className="w-4 h-4 text-slate-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">{activity.company}</p>
                  <p className="text-xs text-slate-400">{activity.action}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{activity.date}</p>
                </div>
                {activity.status === 'danger' && <AlertCircle className="w-4 h-4 text-red-500 ml-auto" />}
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
            View All Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
             <h3 className="text-white font-semibold mb-4 flex items-center">
                 <PieChartIcon className="w-5 h-5 mr-2 text-nabda-warning" />
                 Client Risk Distribution
             </h3>
             <ChartContainer height={200}>
                    <BarChart data={riskDistData} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                         <XAxis type="number" stroke="#64748b" />
                         <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
                         <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                         <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
             </ChartContainer>
          </div>
          
           <div className="bg-nabda-card border border-nabda-border rounded-xl p-6">
             <h3 className="text-white font-semibold mb-4">Trial to Paid Conversion</h3>
             <div className="flex items-center justify-center h-[200px] flex-col">
                 <div className="text-5xl font-bold text-white mb-2">68%</div>
                 <p className="text-slate-400 text-center">of factories upgrade after 14 days</p>
                 <div className="w-full bg-slate-800 h-2 rounded-full mt-6 max-w-xs">
                     <div className="bg-nabda-primary h-full rounded-full" style={{width: '68%'}}></div>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};