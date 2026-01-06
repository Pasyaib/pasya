import React, { useState } from 'react';
import { SystemMetric } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

interface CarVisualizerProps {
  metrics: SystemMetric[];
  steeringAngle?: number;
}

// A high-tech vector fallback in case the PNG is missing
const FallbackChassis = () => (
  <svg viewBox="0 0 200 500" className="h-full w-full opacity-40 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
    <defs>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="50%" stopColor="white" stopOpacity="0.5" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    
    {/* Floor / Diffuser */}
    <path d="M40 150 L160 150 L180 400 L20 400 Z" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Main Body */}
    <path 
      d="M100 20 
         L115 60 L125 140 
         L150 220 L150 380 
         L120 480 L80 480 
         L50 380 L50 220 
         L75 140 L85 60 Z" 
      fill="none" 
      stroke="url(#bodyGrad)" 
      strokeWidth="2" 
    />
    
    {/* Front Wing */}
    <path d="M20 30 L180 30 L160 50 L40 50 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
    
    {/* Rear Wing */}
    <path d="M30 460 L170 460 L170 480 L30 480 Z" fill="none" stroke="white" strokeWidth="2" />
    
    {/* Cockpit */}
    <ellipse cx="100" cy="240" rx="15" ry="35" fill="none" stroke="white" strokeWidth="1" />
    
    {/* Tire Placeholders (Ghosted) */}
    <rect x="10" y="80" width="30" height="60" rx="5" fill="none" stroke="#333" strokeWidth="1" />
    <rect x="160" y="80" width="30" height="60" rx="5" fill="none" stroke="#333" strokeWidth="1" />
    <rect x="10" y="350" width="40" height="70" rx="5" fill="none" stroke="#333" strokeWidth="1" />
    <rect x="150" y="350" width="40" height="70" rx="5" fill="none" stroke="#333" strokeWidth="1" />
  </svg>
);

const CarVisualizer: React.FC<CarVisualizerProps> = ({ metrics, steeringAngle = 0 }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

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

      <div className="relative w-full h-full flex items-center justify-center group">
        
        {/* Loading State */}
        {imageStatus === 'loading' && (
           <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <Loader2 className="w-8 h-8 text-scada-green animate-spin" />
           </div>
        )}

        {/* The Image Container */}
        <div className="relative h-full max-h-[90vh] w-full flex items-center justify-center">
            
            {/* Primary Image: Points to components/f1_wireframe.png */}
            {imageStatus !== 'error' && (
              <img 
                src="components/f1_wireframe.png" 
                alt="F1 Chassis" 
                className={`h-full w-auto object-contain transition-opacity duration-700 ease-in-out ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                    filter: 'invert(1) grayscale(1) contrast(1.2)',
                    mixBlendMode: 'screen'
                }}
                onLoad={() => setImageStatus('loaded')}
                onError={() => setImageStatus('error')}
              />
            )}

            {/* Fallback Chassis: Renders if PNG fails */}
            {imageStatus === 'error' && (
              <div className="h-[85%] w-auto aspect-[2/5] animate-in fade-in duration-700">
                <FallbackChassis />
              </div>
            )}
        </div>

        {/* Debug Indicator (Only if error) */}
        {imageStatus === 'error' && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-zinc-900/80 px-3 py-2 rounded border border-zinc-800 backdrop-blur text-zinc-500 hover:text-white transition-colors cursor-help group/err">
             <AlertCircle size={14} />
             <span className="text-[9px] font-mono">Asset Missing</span>
             
             {/* Tooltip */}
             <div className="absolute bottom-full right-0 mb-2 w-48 bg-black border border-zinc-700 p-2 rounded hidden group-hover/err:block">
               <p className="text-[10px] text-zinc-400">
                 Could not load <code>components/f1_wireframe.png</code>. 
                 Using schematic fallback.
               </p>
             </div>
          </div>
        )}

        {/* --- DYNAMIC OVERLAYS --- */}
        {/* Common container for both Image and Fallback */}
        <div className="absolute inset-0 w-full h-full max-w-[60vh] mx-auto pointer-events-none">
            
            {/* Front Axle Area (Approx 22% from top) */}
            <div className="absolute top-[22%] left-0 w-full flex justify-between px-4">
                {/* Left Wheel Data */}
                <div className="relative group/tire">
                    {/* Brake Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-600 rounded-full blur-3xl transition-opacity duration-300 mix-blend-screen" style={{ opacity: brakeGlowOpacity }}></div>
                    
                    {/* Steering Indicator */}
                    <div className="w-1.5 h-16 border-l-2 border-scada-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 origin-center shadow-[0_0_10px_rgba(29,155,240,0.5)]"
                          style={{ transform: `translate(-50%, -50%) rotate(${steeringAngle}deg)` }}>
                    </div>

                    {/* Label */}
                    <div className="absolute right-full mr-8 top-1/2 -translate-y-1/2 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <span className="h-[1px] w-4 bg-zinc-600/50"></span>
                            <div className="text-[10px] font-mono text-white whitespace-nowrap bg-black/60 backdrop-blur-sm px-1.5 py-0.5 border border-zinc-800 border-r-scada-green border-r-2">
                                {tirePressure} <span className="text-zinc-500 text-[8px]">PSI</span>
                            </div>
                        </div>
                        <div className="text-[8px] font-mono text-scada-text mt-1 mr-6">SOFT C3</div>
                    </div>
                </div>

                {/* Right Wheel Data */}
                <div className="relative group/tire">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-600 rounded-full blur-3xl transition-opacity duration-300 mix-blend-screen" style={{ opacity: brakeGlowOpacity }}></div>
                    
                    <div className="w-1.5 h-16 border-r-2 border-scada-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 origin-center shadow-[0_0_10px_rgba(29,155,240,0.5)]"
                          style={{ transform: `translate(-50%, -50%) rotate(${steeringAngle}deg)` }}>
                    </div>

                    <div className="absolute left-full ml-8 top-1/2 -translate-y-1/2 text-left">
                        <div className="flex items-center gap-2">
                            <div className="text-[10px] font-mono text-white whitespace-nowrap bg-black/60 backdrop-blur-sm px-1.5 py-0.5 border border-zinc-800 border-l-scada-green border-l-2">
                                {tirePressure} <span className="text-zinc-500 text-[8px]">PSI</span>
                            </div>
                            <span className="h-[1px] w-4 bg-zinc-600/50"></span>
                        </div>
                        <div className="text-[8px] font-mono text-scada-text mt-1 ml-6">SOFT C3</div>
                    </div>
                </div>
            </div>

            {/* Rear Axle Area (Approx 78% from top) */}
            <div className="absolute top-[78%] left-0 w-full flex justify-between px-4">
                {/* Rear Left */}
                <div className="relative text-right">
                     <div className="flex items-center justify-end gap-2 absolute right-full mr-8 top-1/2 -translate-y-1/2">
                         <span className="h-[1px] w-4 bg-zinc-600/50"></span>
                         <div className="text-[10px] font-mono text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 border border-zinc-800 border-r-scada-green border-r-2">
                             {tirePressure} <span className="text-zinc-500 text-[8px]">PSI</span>
                         </div>
                     </div>
                </div>
                
                {/* Rear Right */}
                <div className="relative text-left">
                     <div className="flex items-center gap-2 absolute left-full ml-8 top-1/2 -translate-y-1/2">
                         <div className="text-[10px] font-mono text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 border border-zinc-800 border-l-scada-green border-l-2">
                             {tirePressure} <span className="text-zinc-500 text-[8px]">PSI</span>
                         </div>
                         <span className="h-[1px] w-4 bg-zinc-600/50"></span>
                     </div>
                </div>
            </div>

            {/* Engine Cover / Center */}
            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/5 shadow-2xl">
                    <span className={`text-3xl font-bold font-mono tracking-tighter ${engineTemp > 115 ? 'text-scada-red animate-pulse' : 'text-white'}`}>
                        {engineTemp}°
                    </span>
                    <div className="w-16 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full ${ersLevel < 30 ? 'bg-scada-red' : 'bg-scada-amber'}`} style={{ width: `${ersLevel}%` }}></div>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">ERS Deployment</span>
                </div>
            </div>

            {/* Live Status Tag */}
            <div className="absolute top-0 left-0 -translate-y-full mb-2">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-zinc-800 rounded-sm">
                    <div className="w-1.5 h-1.5 bg-scada-green rounded-full animate-pulse shadow-[0_0_8px_#00ba7c]"></div>
                    <span className="text-[9px] text-scada-green font-mono tracking-widest uppercase">Live Data Stream</span>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default CarVisualizer;