import React from 'react';
import { usePlatform } from '../contexts/PlatformContext';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';
import { ReportType } from '../types';

export const Reports: React.FC = () => {
  const { reports, generateInstantReport } = usePlatform();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateWeekly = async () => {
      setIsGenerating(true);
      await generateInstantReport(ReportType.WEEKLY_EXECUTIVE, 'Manual Weekly Report');
      setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white">Reports Archive</h1>
           <p className="text-slate-400">Executive Summaries & Risk Assessments</p>
        </div>
        <button 
            onClick={handleGenerateWeekly}
            disabled={isGenerating}
            className="bg-nabda-primary hover:bg-nabda-primaryDark text-nabda-dark font-bold px-4 py-2 rounded-lg transition-colors"
        >
            {isGenerating ? 'Generating...' : 'Generate Weekly Report'}
        </button>
      </div>

      <div className="bg-nabda-card border border-nabda-border rounded-xl overflow-hidden">
         <table className="w-full text-left">
             <thead className="bg-slate-800 text-slate-400 text-xs uppercase font-semibold">
                 <tr>
                     <th className="px-6 py-4">Report Name</th>
                     <th className="px-6 py-4">Date Generated</th>
                     <th className="px-6 py-4">Risk Score</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Action</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-slate-700">
                 {reports.map((report) => (
                     <tr key={report.id} className="hover:bg-slate-800/50 transition-colors">
                         <td className="px-6 py-4">
                             <div className="flex items-center">
                                 <FileText className="w-5 h-5 text-nabda-primary mr-3" />
                                 <div>
                                     <p className="text-white font-medium">{report.title}</p>
                                     <p className="text-xs text-slate-500 max-w-md truncate">{report.summary}</p>
                                 </div>
                             </div>
                         </td>
                         <td className="px-6 py-4 text-slate-300">
                             {new Date(report.generatedAt).toLocaleDateString()}
                             <span className="text-xs text-slate-500 block">{new Date(report.generatedAt).toLocaleTimeString()}</span>
                         </td>
                         <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${report.riskScore > 20 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                 {report.riskScore}/100
                             </span>
                         </td>
                         <td className="px-6 py-4">
                             {report.status === 'READY' ? (
                                 <span className="flex items-center text-xs text-green-400">
                                     <CheckCircle className="w-3 h-3 mr-1" /> Ready
                                 </span>
                             ) : (
                                 <span className="flex items-center text-xs text-yellow-400">
                                     <Clock className="w-3 h-3 mr-1" /> Processing
                                 </span>
                             )}
                         </td>
                         <td className="px-6 py-4 text-right">
                             <button className="text-nabda-primary hover:text-white transition-colors">
                                 <Download className="w-5 h-5" />
                             </button>
                         </td>
                     </tr>
                 ))}
                 {reports.length === 0 && (
                     <tr>
                         <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                             No reports generated yet. Add data to generate reports automatically.
                         </td>
                     </tr>
                 )}
             </tbody>
         </table>
      </div>
    </div>
  );
};
