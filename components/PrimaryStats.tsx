import React from 'react';
import { Flag, Timer, Zap, Droplets, CircleDashed, ArrowUp, ArrowDown } from 'lucide-react';

interface PrimaryStatsProps {
  velocity: number;
  rpm: number;
  ersLevel: number;
  throttle: number;
  brake: number;
}

const PrimaryStats: React.FC<PrimaryStatsProps> = ({ velocity, rpm, ersLevel, throttle, brake }) => {
  // --- SIMULATED STRATEGY DATA ---
  
  // Use velocity to fluctuate the gap slightly to make it look live
  const gapFluctuation = (Math.sin(Date.now() / 500) * 0.05);
  const gapAhead = (0.842 + gapFluctuation).toFixed(3);
  const gapBehind = (1.205 - gapFluctuation).toFixed(3);

  // Use RPM to simulate fuel flow activity
  const fuelFlow = (rpm / 13000) * 100; // % of max flow

  // Tire Wear simulation based on "throttle" prop just for movement
  const tireWear = 72 - (throttle * 0.01); 

  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden relative group select-none">
       {/* Background Tech Pattern */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
       
       {/* Header */}
       <div className="flex justify-between items-center p-2 px-3 border-b border-scada-border shrink-0 z-10 bg-black/80 backdrop-blur-sm">
        <h3 className="text-[10px] font-mono text-scada-text uppercase tracking-widest flex items-center gap-2">
           <Flag size={10} className="text-white" /> Race Strategy
        </h3>
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-scada-text">MODE:</span>
            <span className="text-[9px] font-bold text-scada-red animate-pulse">PUSH</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3 gap-2 relative z-10">
        
        {/* --- TOP ROW: POSITION & LAPS --- */}
        <div className="flex items-stretch gap-2 h-[80px]">
            {/* Position Card */}
            <div className="flex-1 bg-zinc-900/40 border border-white/5 p-2 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1">
                    <span className="text-[8px] text-scada-text uppercase">POS</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-mono font-bold text-white tracking-tighter">P4</span>
                    <span className="text-[10px] text-zinc-500 font-bold">/ 20</span>
                </div>
            </div>

            {/* Lap Counter Card */}
            <div className="w-[40%] bg-zinc-900/40 border border-white/5 p-2 flex flex-col justify-center items-center relative">
                 <div className="absolute top-0 right-0 p-1">
                    <span className="text-[8px] text-scada-text uppercase">LAP</span>
                </div>
                <span className="text-3xl font-mono font-bold text-scada-blue tracking-tight">14</span>
                <span className="text-[9px] text-zinc-500">OF 56</span>
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                    <div className="h-full bg-scada-blue w-[25%]"></div>
                </div>
            </div>
        </div>

        {/* --- MIDDLE ROW: INTERVALS --- */}
        <div className="flex flex-col gap-1 border-y border-white/5 py-2">
            <div className="flex justify-between items-center px-1">
                <span className="text-[9px] text-zinc-500 uppercase flex items-center gap-1">
                    <ArrowUp size={8} /> Car Ahead
                </span>
                <span className={`font-mono text-sm font-bold ${Number(gapAhead) < 1.0 ? 'text-scada-red animate-pulse' : 'text-scada-text'}`}>
                    +{gapAhead}s <span className="text-[9px] text-zinc-600 font-normal">DRS</span>
                </span>
            </div>
             <div className="w-full h-[1px] bg-white/5"></div>
            <div className="flex justify-between items-center px-1">
                <span className="text-[9px] text-zinc-500 uppercase flex items-center gap-1">
                     <ArrowDown size={8} /> Car Behind
                </span>
                <span className="font-mono text-sm font-bold text-scada-green">
                    +{gapBehind}s
                </span>
            </div>
        </div>

        {/* --- BOTTOM ROW: TIRES & FUEL --- */}
        <div className="flex-1 grid grid-cols-2 gap-2">
            
            {/* Tire Widget */}
            <div className="bg-zinc-900/20 border border-white/5 p-1 flex items-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                     {/* Soft Compound Ring */}
                     <div className="absolute inset-0 rounded-full border-2 border-scada-red opacity-80"></div>
                     <span className="text-xs font-bold text-white">S</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase">Compound</span>
                    <span className="text-[10px] font-bold text-white">SOFT C3</span>
                    <span className="text-[8px] text-scada-text">Age: 12 Laps</span>
                </div>
            </div>

            {/* Fuel Widget */}
            <div className="bg-zinc-900/20 border border-white/5 p-1 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[8px] text-zinc-500 uppercase">Fuel Target</span>
                    <span className="text-[10px] font-mono font-bold text-scada-green">+1.2KG</span>
                </div>
                {/* Instant Flow Bar (simulated by RPM) */}
                <div className="h-1.5 w-full bg-black rounded-sm overflow-hidden border border-zinc-800">
                    <div 
                        className="h-full bg-scada-blue transition-all duration-100" 
                        style={{ width: `${fuelFlow}%` }}
                    />
                </div>
                 <div className="text-[7px] text-zinc-600 text-right mt-0.5">FLOW RATE</div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default PrimaryStats;