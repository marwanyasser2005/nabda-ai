
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { PlatformOverview } from './pages/PlatformOverview';
import { PricingPage } from './pages/PricingPage';
import { WaterGuard } from './pages/WaterGuard';
import { EnergyGuard } from './pages/EnergyGuard';
import { CarbonIntelligence } from './pages/CarbonIntelligence';
import { ClimateIntelligence } from './pages/ClimateIntelligence';
import { Reports } from './pages/Reports';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { Settings } from './pages/Settings';
import { PlatformProvider } from './contexts/PlatformContext';

const App: React.FC = () => {
  return (
    <PlatformProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/platform" element={<PlatformOverview />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/water" element={<WaterGuard />} />
            <Route path="/app/energy" element={<EnergyGuard />} />
            <Route path="/app/carbon" element={<CarbonIntelligence />} />
            <Route path="/app/climate" element={<ClimateIntelligence />} />
            <Route path="/app/reports" element={<Reports />} />
            <Route path="/app/admin" element={<AdminAnalytics />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </PlatformProvider>
  );
};

export default App;
