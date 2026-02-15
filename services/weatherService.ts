import { ClimateData, GeoLocation } from '../types';

// Robust API URL resolution:
// 1. Env Variable (Production)
// 2. Localhost Backend (Development fallback)
// 3. Relative path (Production with Proxy)
const API_URL = (() => {
  const env = (import.meta as any).env;
  if (env?.VITE_API_URL) return env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return 'http://localhost:8080/api';
  return '/api';
})();

const CACHE_KEY_LOC = 'nabda_loc_v2';
const CACHE_KEY_DENIED = 'nabda_gps_denied';

// --- MOCK DATA GENERATORS (Offline Mode) ---
const generateMockClimateData = (): ClimateData[] => {
  const data: ClimateData[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - 2 + i);
    data.push({
      date: d.toISOString(),
      tempC: 32 + Math.random() * 5,
      humidity: 40 + Math.random() * 20,
      windSpeed: 12,
      aqi: 65 + Math.floor(Math.random() * 30),
      pm25: 15,
      condition: i % 2 === 0 ? 'Clear Sky' : 'Haze',
      isForecast: i > 2,
      source: i === 2 ? 'REALTIME' : (i < 2 ? 'HISTORY' : 'FORECAST')
    });
  }
  return data;
};

export const weatherService = {
  
  // 1. ROBUST GEOLOCATION STRATEGY
  getCurrentPosition: (): Promise<GeoLocation> => {
    return new Promise(async (resolve) => {
      // A. Check LocalStorage Cache (Prevent jitter)
      const cached = localStorage.getItem(CACHE_KEY_LOC);
      if (cached) {
        resolve(JSON.parse(cached));
        return;
      }

      // B. Check Session Denied Flag
      const isDenied = sessionStorage.getItem(CACHE_KEY_DENIED);

      // C. Browser GPS
      if (navigator.geolocation && !isDenied) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
             try {
                const res = await fetch(`${API_URL}/climate/geocode?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                if (!res.ok) throw new Error("Geocode unavailable");
                const data = await res.json();
                
                const loc = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    city: data.city || 'Industrial Zone',
                    country: data.country || 'EG'
                };
                localStorage.setItem(CACHE_KEY_LOC, JSON.stringify(loc));
                resolve(loc);
             } catch {
                const loc = { 
                  lat: pos.coords.latitude, 
                  lon: pos.coords.longitude, 
                  city: 'Local Facility', 
                  country: 'EG' 
                };
                localStorage.setItem(CACHE_KEY_LOC, JSON.stringify(loc));
                resolve(loc);
             }
          },
          (err) => {
             // Silence permission denied errors in console, just fallback
             sessionStorage.setItem(CACHE_KEY_DENIED, 'true');
             weatherService.getIpLocation().then(resolve);
          },
          { timeout: 5000, enableHighAccuracy: false }
        );
      } else {
        weatherService.getIpLocation().then(resolve);
      }
    });
  },

  getIpLocation: async (): Promise<GeoLocation> => {
    try {
      // Try Backend
      const res = await fetch(`${API_URL}/climate/ip-location`);
      if (res.ok) {
        const data = await res.json();
        const loc = {
          lat: data.lat || 30.04,
          lon: data.lon || 31.23,
          city: data.city || 'Cairo',
          country: data.country || 'EG'
        };
        localStorage.setItem(CACHE_KEY_LOC, JSON.stringify(loc));
        return loc;
      }
      throw new Error("Backend IP Service failed");
    } catch (e) {
      // Offline/Demo Fallback - Return Cairo immediately without error logging
      const defaultLoc = { lat: 30.04, lon: 31.23, city: 'Cairo (Demo)', country: 'EG' };
      localStorage.setItem(CACHE_KEY_LOC, JSON.stringify(defaultLoc));
      return defaultLoc;
    }
  },

  // 2. WEATHER FETCHING
  fetchClimateData: async (loc: GeoLocation): Promise<ClimateData[]> => {
    try {
      const res = await fetch(`${API_URL}/climate/forecast?lat=${loc.lat}&lon=${loc.lon}`);
      if (res.ok) {
        return await res.json();
      }
      throw new Error("Weather API failed");
    } catch (e) {
      // Offline Mode: Generate realistic mock data
      return generateMockClimateData();
    }
  }
};