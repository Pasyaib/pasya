import React, { useEffect, useState } from 'react';
import { CloudRain, Wind, Thermometer, Droplets, Sun, MapPin } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface WeatherData {
  airTemp: number;
  trackTemp: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  rainChance: number;
  condition: string;
  location: string;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    airTemp: 18.5,
    trackTemp: 28.2,
    humidity: 55,
    windSpeed: 3.2,
    windDir: 'NE',
    rainChance: 0,
    condition: 'DRY',
    location: 'Silverstone'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // We use gemini-3-flash-preview for fast, grounded search results
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Get the current real-time weather for Silverstone Circuit, UK. 
                     Return a purely JSON object with these exact keys: 
                     { 
                       "airTemp": number (Celsius), 
                       "humidity": number (0-100), 
                       "windSpeed": number (m/s), 
                       "windDir": string (short compass e.g. NW), 
                       "rainChance": number (0-100), 
                       "condition": string (short e.g. Cloudy, Rain, Sunny) 
                     }
                     Estimate trackTemp as airTemp + 10 degrees.`,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json'
          }
        });

        const text = response.text;
        if (text) {
          const data = JSON.parse(text);
          setWeather(prev => ({
            ...prev,
            ...data,
            // Ensure track temp is derived if model misses it
            trackTemp: data.trackTemp || (data.airTemp + 9.5)
          }));
        }
      } catch (error) {
        console.error("Weather fetch failed, using fallback", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  // Visual helper for Wind Direction rotation
  const getRotation = (dir: string) => {
    const dirs: {[key: string]: number} = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
    return dirs[dir] || 0;
  };

  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden relative">
      {/* Loading overlay for initial fetch */}
      {loading && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-scada-blue rounded-full animate-ping z-20"></div>
      )}

      <div className="flex justify-between items-center p-2 border-b border-scada-border shrink-0">
        <h3 className="text-[10px] font-mono text-scada-text uppercase tracking-widest flex items-center gap-1">
          <MapPin size={10} /> {weather.location}
        </h3>
        <span className={`text-[9px] font-bold uppercase ${weather.rainChance > 40 ? 'text-scada-amber' : 'text-scada-green'}`}>
          TRACK: {weather.rainChance > 40 ? 'WET' : 'DRY'}
        </span>
      </div>
      
      <div className="flex-1 flex min-h-0">
         {/* Data List */}
         <div className="flex-1 flex flex-col border-r border-scada-border">
            {/* Track Temp */}
            <div className="flex-1 flex items-center justify-between px-3 border-b border-scada-border/40 hover:bg-white/5 transition-colors group">
               <div className="flex items-center gap-2 text-scada-text group-hover:text-white transition-colors">
                  <Thermometer size={12} />
                  <span className="text-[9px] uppercase tracking-wider">Track</span>
               </div>
               <span className="font-mono text-white font-medium text-sm">
                  {weather.trackTemp.toFixed(1)}<span className="text-zinc-500 text-[10px] ml-0.5">°C</span>
               </span>
            </div>
            {/* Air Temp */}
            <div className="flex-1 flex items-center justify-between px-3 border-b border-scada-border/40 hover:bg-white/5 transition-colors group">
               <div className="flex items-center gap-2 text-scada-text group-hover:text-white transition-colors">
                  <Sun size={12} />
                  <span className="text-[9px] uppercase tracking-wider">Air</span>
               </div>
               <span className="font-mono text-white font-medium text-sm">
                  {weather.airTemp.toFixed(1)}<span className="text-zinc-500 text-[10px] ml-0.5">°C</span>
               </span>
            </div>
            {/* Humidity */}
             <div className="flex-1 flex items-center justify-between px-3 hover:bg-white/5 transition-colors group">
               <div className="flex items-center gap-2 text-scada-text group-hover:text-white transition-colors">
                  <Droplets size={12} />
                  <span className="text-[9px] uppercase tracking-wider">Hum</span>
               </div>
               <span className="font-mono text-scada-blue font-medium text-sm">
                  {weather.humidity}<span className="text-zinc-500 text-[10px] ml-0.5">%</span>
               </span>
            </div>
         </div>
         
         {/* Wind / Rain Visuals */}
         <div className="w-[90px] flex flex-col">
             {/* Wind Section */}
             <div className="flex-1 relative flex flex-col items-center justify-center p-1 border-b border-scada-border/40 overflow-hidden">
                 {/* Compass Background */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-10">
                     <div className="w-12 h-12 rounded-full border border-white"></div>
                     <div className="absolute w-16 h-[1px] bg-white"></div>
                     <div className="absolute w-[1px] h-16 bg-white"></div>
                 </div>
                 
                 {/* Wind Arrow */}
                 <div className="mb-1 transition-transform duration-500" style={{ transform: `rotate(${getRotation(weather.windDir)}deg)` }}>
                     <Wind size={18} className="text-scada-text" />
                 </div>
                 <div className="flex items-baseline gap-1 relative z-10">
                    <span className="font-mono text-white font-bold text-sm">{weather.windSpeed}</span>
                    <span className="text-[8px] text-scada-text">m/s</span>
                 </div>
                 <div className="text-[8px] text-scada-text uppercase tracking-widest mt-0.5">{weather.windDir}</div>
             </div>

             {/* Rain Section */}
             <div className="h-8 bg-white/5 flex items-center justify-center gap-2 hover:bg-scada-blue/10 transition-colors cursor-default">
                 <CloudRain size={12} className={weather.rainChance > 0 ? "text-scada-blue" : "text-zinc-600"} />
                 <span className={`font-mono text-xs font-bold ${weather.rainChance > 0 ? "text-scada-blue" : "text-zinc-600"}`}>
                    {weather.rainChance}%
                 </span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default WeatherWidget;