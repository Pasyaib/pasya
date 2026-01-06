import React, { useState, useEffect } from 'react';

const StressLevel: React.FC = () => {
  const [load, setLoad] = useState(42);
  const [peak, setPeak] = useState(68);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(prev => {
         // Random walk
         const change = (Math.random() - 0.5) * 10;
         const next = Math.max(10, Math.min(99, prev + change));
         
         if (next > peak) setPeak(next);
         return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [peak]);

  // Determine color based on load
  const getColor = (val: number) => {
     if (val > 85) return 'bg-scada-red';
     if (val > 65) return 'bg-scada-amber';
     return 'bg-scada-green';
  };
  
  const segments = 24;
  const activeSegments = Math.floor((load / 100) * segments);

  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b border-scada-border shrink-0">
        <h3 className="text-xs font-mono text-scada-text uppercase tracking-wide">
          Stress Index
        </h3>
        <div className="text-[9px] text-scada-text font-mono uppercase opacity-70">
           PK: <span className="text-white">{peak.toFixed(0)}%</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col justify-center gap-3 min-h-0">
         <div className="flex justify-between items-end">
             <span className="text-[10px] text-scada-text font-mono uppercase tracking-widest">Composite Load</span>
             <span className={`text-3xl font-mono font-bold tracking-tighter leading-none ${load > 85 ? 'text-scada-red' : 'text-white'}`}>
                 {load.toFixed(0)}%
             </span>
         </div>
         
         {/* Segmented Bar */}
         <div className="flex gap-0.5 h-3 w-full">
            {Array.from({ length: segments }).map((_, i) => (
                <div 
                    key={i} 
                    className={`flex-1 rounded-[1px] transition-all duration-300 ${
                        i < activeSegments 
                        ? getColor(load) + ' opacity-100 shadow-[0_0_5px_currentColor]' 
                        : 'bg-zinc-900 opacity-50'
                    }`}
                />
            ))}
         </div>
      </div>
    </div>
  );
};

export default StressLevel;