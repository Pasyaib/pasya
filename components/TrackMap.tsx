import React, { useRef, useEffect, useState } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

interface TrackMapProps {
  cursorProgress?: number | null; // 0 to 1
}

const TrackMap: React.FC<TrackMapProps> = ({ cursorProgress }) => {
  const trackPathRef = useRef<SVGPathElement>(null);
  const [ghostPos, setGhostPos] = useState<{x: number, y: number} | null>(null);

  // SVG Path for a complex loop track
  const trackPath = "M 70 200 C 70 100 150 50 220 100 S 330 50 430 100 S 330 250 250 200 S 70 280 70 200 Z";
  // Pit lane bypasses the start/finish straight (approx 70,200)
  const pitLanePath = "M 80 230 Q 30 200 80 170"; 

  const historicalStops = [
      { lap: 8, x: 55, y: 200, type: 'M' },
      { lap: 24, x: 55, y: 200, type: 'H' }
  ];

  // Calculate position on track based on cursorProgress
  useEffect(() => {
    if (trackPathRef.current && cursorProgress !== undefined && cursorProgress !== null) {
      const length = trackPathRef.current.getTotalLength();
      // Ensure range 0-1
      const clampedProgress = Math.max(0, Math.min(1, cursorProgress));
      const point = trackPathRef.current.getPointAtLength(length * clampedProgress);
      setGhostPos({ x: point.x, y: point.y });
    } else {
      setGhostPos(null);
    }
  }, [cursorProgress]);
  
  return (
      <div className="flex flex-col h-full bg-gradient-to-b from-[#151515] to-[#080808] rounded-xl border border-white/5 shadow-panel overflow-hidden relative group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-white/10"></div>
          
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-white/5 shrink-0 bg-black/20 backdrop-blur-sm z-10">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
               <MapPin size={12} className="text-scada-blue" /> Race Control
            </h3>
             <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-scada-green animate-pulse shadow-[0_0_8px_#00ba7c]"></span>
                 <span className="text-[9px] text-white font-bold tracking-widest uppercase">Track Clear</span>
             </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative flex items-center justify-center bg-[#050505] overflow-hidden">
             {/* Dynamic Grid Background specific to Map */}
              <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
              
              <svg viewBox="0 0 500 300" className="w-full h-full p-6 drop-shadow-2xl">
                 <defs>
                     <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                         <feGaussianBlur stdDeviation="4" result="blur" />
                         <feComposite in="SourceGraphic" in2="blur" operator="over" />
                     </filter>
                     <marker id="arrow-head" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                         <path d="M0,0 L4,2 L0,4 L0,0" fill="#444" />
                     </marker>
                 </defs>

                 {/* Pit Lane Path */}
                 <path d={pitLanePath} stroke="#333" strokeWidth="3" fill="none" strokeDasharray="4 2" />
                 <text x="35" y="200" fill="#555" fontSize="8" fontFamily="monospace" transform="rotate(-90 35 200)">PIT LANE</text>

                 {/* Historical Pit Stop Indicators */}
                 {historicalStops.map((stop, i) => (
                    <g key={i} transform={`translate(${stop.x + (i*10)}, ${stop.y})`}>
                        <circle r="3" fill="#111" stroke="#666" strokeWidth="1" />
                        <text x="5" y="2" fontSize="6" fill="#888" fontFamily="monospace">L{stop.lap}</text>
                    </g>
                 ))}

                 {/* Track Border/Glow */}
                 <path d={trackPath} stroke="#1d9bf0" strokeWidth="14" fill="none" strokeOpacity="0.05" strokeLinecap="round" strokeLinejoin="round" />
                 
                 {/* Main Track Line (Hidden Ref for Calculation) */}
                 <path ref={trackPathRef} d={trackPath} stroke="none" fill="none" />
                 
                 {/* Visual Track Line */}
                 <path id="trackLine" d={trackPath} stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                 
                 {/* Sector Colors (Static Simulation) */}
                 <path d={trackPath} stroke="#e7e9ea" strokeWidth="1.5" fill="none" strokeDasharray="80 200 100 1000" strokeDashoffset="0" strokeLinecap="round" opacity="0.5" />

                 {/* Driver Dot (Us - Green) - Only shows if NOT hovering charts */}
                 {!ghostPos && (
                    <circle r="5" fill="#00ba7c" stroke="#black" strokeWidth="1">
                        <animateMotion dur="18s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                        <mpath href="#trackLine" />
                        </animateMotion>
                        <animate attributeName="r" values="5;6;5" dur="1s" repeatCount="indefinite" />
                    </circle>
                 )}
                 
                 {/* Ghost Dot (Synchronized Cursor) - White */}
                 {ghostPos && (
                     <g transform={`translate(${ghostPos.x}, ${ghostPos.y})`}>
                         <circle r="6" fill="#fff" stroke="#00ba7c" strokeWidth="2" className="animate-ping absolute opacity-50" />
                         <circle r="4" fill="#fff" stroke="#111" strokeWidth="1" />
                         <line x1="0" y1="-10" x2="0" y2="-20" stroke="#fff" strokeWidth="1" />
                         <text x="0" y="-25" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="monospace" fontWeight="bold">REPLAY</text>
                     </g>
                 )}
                 
                 {/* Rival Dot (Pink) */}
                 <circle r="3" fill="#f91880" opacity="0.8">
                    <animateMotion dur="17.8s" repeatCount="indefinite" rotate="auto" begin="1s" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                       <mpath href="#trackLine" />
                    </animateMotion>
                 </circle>
              </svg>

              {/* Status Overlay: Gap */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                  <div className="bg-black/80 border border-white/10 px-2 py-1.5 backdrop-blur-md rounded-sm shadow-lg">
                      <span className="text-[8px] text-zinc-500 uppercase block tracking-wider">Gap Ahead</span>
                      <span className="text-xs font-mono text-scada-red font-bold drop-shadow-[0_0_5px_rgba(249,24,128,0.5)]">+12.4s</span>
                  </div>
              </div>
              
              {/* Yellow Flag Indicator */}
              <div className="absolute top-3 right-3 opacity-20">
                  <AlertTriangle size={16} className="text-scada-amber" />
              </div>

          </div>
      </div>
  )
}

export default TrackMap;