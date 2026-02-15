import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { LogOut, Menu, X, ShieldCheck, Clock, LayoutDashboard } from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let trialDays = 0;
  try {
    const platform = usePlatform();
    trialDays = platform.trialDaysLeft;
  } catch (e) {
    // Context safely ignored outside app routes
  }

  // Define Public Paths where Sidebar should NOT appear
  const isPublicPage = ['/', '/platform', '/pricing'].includes(location.pathname);

  if (isPublicPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-nabda-dark text-slate-200 flex overflow-hidden">
      {/* Sidebar for Desktop - Hidden on Print */}
      <aside className="hidden md:flex w-64 flex-col bg-nabda-card border-r border-nabda-border print:hidden">
        <div className="h-16 flex items-center px-6 border-b border-nabda-border cursor-pointer" onClick={() => navigate('/')}>
           <ShieldCheck className="w-8 h-8 text-nabda-primary mr-2" />
           <span className="text-xl font-bold tracking-tight text-white">NABDA</span>
        </div>
        
        {/* Trial Banner */}
        {trialDays > 0 && trialDays <= 14 && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-center">
            <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center">
              <Clock className="w-3 h-3 mr-1" />
              {trialDays} Days Left
            </p>
            <button 
              onClick={() => navigate('/pricing')}
              className="mt-2 text-[10px] bg-white text-indigo-900 px-2 py-1 rounded font-bold hover:bg-opacity-90 w-full"
            >
              Upgrade Plan
            </button>
          </div>
        )}

        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-nabda-primary/10 text-nabda-primary border border-nabda-primary/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </NavLink>
          ))}
          {/* Admin Link for Demo */}
          <NavLink
            to="/app/admin"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mt-6 ${
                isActive
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'text-slate-500 hover:text-purple-400 hover:bg-slate-800'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Admin Panel
          </NavLink>
        </nav>

        <div className="p-4 border-t border-nabda-border">
          <div className="bg-slate-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Weekly Protocol</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white">Next: Water Input</span>
              <span className="text-nabda-warning">Tue</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Hidden on Print */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-nabda-card border-b border-nabda-border print:hidden">
          <div className="flex items-center">
            <ShieldCheck className="w-6 h-6 text-nabda-primary mr-2" />
            <span className="text-lg font-bold text-white">NABDA</span>
          </div>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-slate-300">
            {isMobileOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Nav Overlay */}
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-nabda-dark bg-opacity-95 flex flex-col p-4 print:hidden">
             <div className="flex justify-end mb-8">
               <button onClick={() => setIsMobileOpen(false)}><X className="text-white w-8 h-8" /></button>
             </div>
             <nav className="space-y-4">
               {NAV_LINKS.map((link) => (
                 <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-lg font-medium rounded-lg ${
                        isActive ? 'text-nabda-primary' : 'text-slate-300'
                      }`
                    }
                  >
                    <link.icon className="w-6 h-6 mr-4" />
                    {link.name}
                  </NavLink>
               ))}
               <NavLink
                  to="/app/admin"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center px-4 py-3 text-lg font-medium rounded-lg text-purple-400"
               >
                 <LayoutDashboard className="w-6 h-6 mr-4" />
                 Admin Panel
               </NavLink>
             </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-nabda-dark print:bg-white print:text-black print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
};
