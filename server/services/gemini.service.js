
const { GoogleGenAI } = require('@google/genai');

// --- CONFIG ---
const DAILY_LIMIT = 50; // Strict limit for demo/production cost control
const CACHE_TTL = 1000 * 60 * 60 * 48; // 48 Hours Cache

// --- IN-MEMORY STORE ---
const cache = new Map(); 
let requestCount = 0;
let lastReset = Date.now();

// --- RESET LOGIC ---
setInterval(() => {
  const now = Date.now();
  if (now - lastReset > 86400000) { // 24 Hours
    requestCount = 0;
    lastReset = now;
    console.log("♻️ AI Quota Reset");
  }
}, 60000 * 60);

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const generateHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return "hash_" + hash;
};

exports.generateContent = async (prompt, systemInstruction) => {
  
  // 1. CACHE CHECK (Aggressive caching to save money)
  const key = generateHash(prompt + systemInstruction);
  if (cache.has(key)) {
    console.log("⚡ AI Cache Hit");
    return cache.get(key);
  }

  // 2. RATE LIMIT CHECK
  if (requestCount >= DAILY_LIMIT) {
    console.warn("🛑 Daily AI Limit Reached - Returning Fallback");
    return "Analysis paused (Daily Quota Reached). Please check back tomorrow."; 
  }

  // 3. API CALL
  const ai = getClient();
  if (!ai) throw new Error("API Key Missing");

  try {
    requestCount++;
    console.log(`🤖 AI Call (${requestCount}/${DAILY_LIMIT})`);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Fastest/Cheapest
      contents: prompt,
      config: {
        temperature: 0.3, // Low temp for factual analysis
        maxOutputTokens: 250, 
        systemInstruction: systemInstruction
      }
    });

    const text = response.text;
    
    // 4. CACHE SET
    if (text) {
      cache.set(key, text);
      // Simple cache expiration cleanup could go here
    }
    
    return text;

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    requestCount--; 
    throw error;
  }
};
