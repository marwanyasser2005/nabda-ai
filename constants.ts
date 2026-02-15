import { SubscriptionPlan } from './types';
import { LayoutDashboard, Droplets, Zap, Wind, FileText, Settings, CloudSun } from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
  { name: 'Water Guard', path: '/app/water', icon: Droplets },
  { name: 'Energy & Tariffs', path: '/app/energy', icon: Zap },
  { name: 'Air & Climate', path: '/app/climate', icon: CloudSun },
  { name: 'Carbon Intelligence', path: '/app/carbon', icon: Wind },
  { name: 'Reports', path: '/app/reports', icon: FileText },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export const PRICING_PLANS: SubscriptionPlan[] = [
  {
    id: 'standard',
    name: 'Standard Protection',
    priceEGP: 7500,
    features: [
      'Basic Resource Monitoring',
      'Monthly PDF Reports',
      '1 User Account',
      'Standard Support'
    ]
  },
  {
    id: 'business',
    name: 'Business Protection',
    priceEGP: 15000,
    features: [
      'Real-time Anomaly Detection',
      'Weekly AI Risk Reports',
      '5 User Accounts',
      'Carbon Baseline Calc',
      'Priority Support',
      'Air Quality Alerts'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Protection',
    priceEGP: 150000,
    features: [
      'Full Factory Digital Twin',
      'Predictive Maintenance AI',
      'Unlimited Users',
      'Scope 1, 2 & 3 Reporting',
      'Dedicated Account Manager'
    ]
  }
];

export const MOCK_CHART_DATA = [
  { name: 'Week 1', water: 4000, energy: 2400, carbon: 2400 },
  { name: 'Week 2', water: 3000, energy: 1398, carbon: 2210 },
  { name: 'Week 3', water: 2000, energy: 9800, carbon: 2290 },
  { name: 'Week 4', water: 2780, energy: 3908, carbon: 2000 },
];
