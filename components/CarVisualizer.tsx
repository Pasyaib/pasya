import React, { useState } from 'react';
import { SystemMetric } from '../types';
import { ImageOff } from 'lucide-react';

interface CarVisualizerProps {
  metrics: SystemMetric[];
  steeringAngle?: number;
}

const CarVisualizer: React.FC<CarVisualizerProps> = ({ metrics, steeringAngle = 0 }) => {
  const [imageError, setImageError] = useState(false);

  const tirePressure = metrics.find(m => m.name === 'Tire Pressure')?.value || 22.1;
  const engineTemp = metrics.find(m => m.name === 'Engine Temp')?.value || 112;
  const brakeTemp = metrics.find(m => m.name === 'Brake Temp')?.value || 890;
  const ersLevel = metrics.find(m => m.name === 'ERS Batt')?.value || 34;

  // Determine brake glow opacity based on temp
  const brakeGlowOpacity = Math.max(0, (brakeTemp - 500) / 1000);

  return (
    <div className="flex flex-col h-full relative overflow-hidden items-center justify-center p-4 bg-black">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(50,50,50,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(50,50,50,0.2)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {/* Central Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-scada-blue/5 to-transparent opacity-50 pointer-events-none"></div>

      <div className="relative w-full max-w-lg h-full flex items-center justify-center group">
        
        {!imageError ? (
          <img 
            src="/f1_wireframe.png" 
            alt="F1 Chassis" 
            className="w-full h-full object-contain opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] mix-blend-screen"
            style={{ maxHeight: '85vh' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-zinc-700 p-12 rounded-lg bg-zinc-900/50">
             <ImageOff className="w-12 h-12 text-zinc-600 mb-4" />
             <p className="text-zinc-400 font-mono text-xs">Image not found</p>
             <p className="text-zinc-600 font-mono text-[10px] mt-2">Save file as public/f1_wireframe.png</p>
          </div>
        )}

        {/* --- DYNAMIC OVERLAYS --- */}
        
        {/* Front Axle Area (Approx 28% from top) */}
        <div className="absolute top-[28%] left-0 w-full flex justify-between px-[15%] pointer-events-none">
             {/* Left Wheel Data */}
             <div className="relative">
                 {/* Brake Glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-600 rounded-full blur-xl transition-opacity duration-300" style={{ opacity: brakeGlowOpacity }}></div>
                 
                 {/* Steering Indicator Ghost */}
                 <div className="w-1 h-12 border-l-2 border-cyan-400/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
                      style={{ transform: `translate(-50%, -50%) rotate(${steeringAngle}deg)` }}>
                 </div>

                 <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 text-right">
                    <div className="text-[10px] font-mono text-white whitespace-nowrap">{tirePressure} PSI</div>
                    <div className="text-[8px] font-mono text-zinc-500">SOFT C3</div>
                 </div>
             </div>

             {/* Right Wheel Data */}
             <div className="relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-600 rounded-full blur-xl transition-opacity duration-300" style={{ opacity: brakeGlowOpacity }}></div>
                 
                 <div className="w-1 h-12 border-r-2 border-cyan-400/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
                      style={{ transform: `translate(-50%, -50%) rotate(${steeringAngle}deg)` }}>
                 </div>

                 <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 text-left">
                    <div className="text-[10px] font-mono text-white whitespace-nowrap">{tirePressure} PSI</div>
                    <div className="text-[8px] font-mono text-zinc-500">SOFT C3</div>
                 </div>
             </div>
        </div>

        {/* Rear Axle Area (Approx 75% from top) */}
        <div className="absolute top-[75%] left-0 w-full flex justify-between px-[12%] pointer-events-none">
            <div className="text-right pr-6">
                <div className="text-[10px] font-mono text-white">{tirePressure} PSI</div>
            </div>
            <div className="text-left pl-6">
                <div className="text-[10px] font-mono text-white">{tirePressure} PSI</div>
            </div>
        </div>

        {/* Engine Cover / Center */}
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="flex flex-col items-center">
                 <span className={`text-2xl font-bold font-mono ${engineTemp > 115 ? 'text-scada-red animate-pulse' : 'text-white/90'}`}>
                    {engineTemp}°
                 </span>
                 <div className="w-16 h-1 bg-zinc-800 rounded mt-1 overflow-hidden">
                    <div className={`h-full ${ersLevel < 30 ? 'bg-scada-red' : 'bg-scada-amber'}`} style={{ width: `${ersLevel}%` }}></div>
                 </div>
                 <span className="text-[8px] font-mono text-zinc-500 mt-1">ERS {ersLevel}%</span>
             </div>
        </div>

        {/* Live Status Tag */}
        <div className="absolute top-4 left-4">
             <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 border border-zinc-800 rounded-full">
                 <div className="w-1.5 h-1.5 bg-scada-green rounded-full animate-pulse"></div>
                 <span className="text-[9px] text-scada-green font-mono tracking-widest uppercase">Live Telemetry</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default CarVisualizer;