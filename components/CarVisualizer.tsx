import React, { useMemo, useState } from 'react';
import { SystemMetric } from '../types';
import { Layers, Wind, Thermometer, Zap } from 'lucide-react';

interface CarVisualizerProps {
  metrics: SystemMetric[];
  steeringAngle?: number;
  throttle?: number;
  brake?: number;
}

type ViewMode = 'STD' | 'THM' | 'AERO';

// --- SUB-COMPONENTS ---

const TireZone: React.FC<{ x: number; y: number; width: number; height: number; temp: number; mode: ViewMode }> = ({ x, y, width, height, temp, mode }) => {
    const getColor = (t: number) => {
        if (mode === 'THM') {
             // Heatmap style
             if (t < 80) return '#3b82f6';
             if (t < 90) return '#00ba7c';
             if (t < 105) return '#ffd400';
             if (t < 115) return '#f91880';
             return '#ffffff';
        }
        // Standard visuals
        return '#000000'; 
    };
    
    const opacity = mode === 'THM' ? 0.8 : 0.0; // Only visible opacity in THM mode or if wearing

    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={getColor(temp)} fillOpacity={opacity} stroke="none" />
        </g>
    );
};

const DigitalTwin: React.FC<{ 
  steeringAngle: number; 
  brakeTemp: number; 
  engineTemp: number; 
  tireTemp: number;
  tireWear: number;
  ersLevel: number;
  velocity: number;
  rpm: number;
  downforce: number;
  throttle: number;
  brake: number;
  mode: ViewMode;
}> = ({ steeringAngle, brakeTemp, engineTemp, tireTemp, tireWear, ersLevel, velocity, rpm, downforce, throttle, brake, mode }) => {
  
  // Physics Simulation Constants
  const latG = (Math.sin(steeringAngle * (Math.PI / 180)) * (velocity / 50));
  const longG = (rpm > 11500 ? 0.5 : 0) - (brakeTemp > 650 ? 1.0 : 0);
  
  const suspOffsetLeft = -latG * 2; 
  const suspOffsetRight = latG * 2;
  const diveOffset = -longG * 3; 
  const drsOpen = velocity > 300;
  
  // Tire Temps
  const tempInner = tireTemp + (velocity * 0.05);
  const tempMiddle = tireTemp;
  const tempOuter = tireTemp + (Math.abs(steeringAngle) * 2);

  // ERS Logic
  const harvesting = brake > 5;
  const deploying = throttle > 80;
  
  // Geometry
  const trackWidthHalf = 115;
  const wheelY_Front = 160 + diveOffset;
  const wheelY_Rear = 560;
  const chassisAttachX_Front = 25;
  const chassisAttachX_Rear = 30;
  const wearFactor = Math.max(0, Math.min(1, (100 - tireWear) / 100));
  const dfFactor = Math.max(0, Math.min(1, downforce / 2500));
  const flowDur = Math.max(0.2, 80 / (velocity || 1)) + 's';
  const gForceLat = latG * 4.0;
  
  // View Mode Opacities
  const bodyOpacity = mode === 'THM' ? 0.1 : 1;
  const mechOpacity = mode === 'AERO' ? 0.3 : 1;
  
  return (
    <svg viewBox="-100 -50 600 900" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <defs>
        <pattern id="grid-micro" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="0.5"/>
        </pattern>
        
        <pattern id="carbon-fibre" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="4" height="4" fill="#0f0f0f" />
            <rect width="2" height="4" fill="#161616" />
            <rect width="2" height="4" x="2" fill="#0a0a0a" />
        </pattern>

        <pattern id="wear-texture" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="#000" fillOpacity="0.3" />
        </pattern>

        <linearGradient id="titanium-shine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#555" />
            <stop offset="30%" stopColor="#999" />
            <stop offset="50%" stopColor="#fff" />
            <stop offset="70%" stopColor="#999" />
            <stop offset="100%" stopColor="#555" />
        </linearGradient>

        <linearGradient id="body-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="20%" stopColor="#222" />
            <stop offset="50%" stopColor="#333" />
            <stop offset="80%" stopColor="#222" />
            <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        
        <linearGradient id="sidepod-undercut" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="specular-curve" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="pressure-field" x1="0%" y1="0%" x2="0%" y2="100%">
            {/* Aero mode uses Heatmap colors for pressure, STD uses subtle blue */}
            <stop offset="0%" stopColor={mode === 'AERO' ? '#f91880' : '#00ba7c'} stopOpacity={0.3 + (dfFactor * 0.3)} />
            <stop offset="100%" stopColor={mode === 'AERO' ? '#3b82f6' : '#1d9bf0'} stopOpacity={0.05} />
        </linearGradient>

        <linearGradient id="drs-flow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ba7c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00ba7c" stopOpacity="0" />
        </linearGradient>
        
        <linearGradient id="front-flow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ba7c" stopOpacity="0" />
            <stop offset="20%" stopColor="#1d9bf0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1d9bf0" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="motion-blur-wheel" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#111" />
            <stop offset="60%" stopColor="#222" />
            <stop offset="80%" stopColor="#111" />
            <stop offset="90%" stopColor="#333" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000" />
        </radialGradient>

        <radialGradient id="exhaust-heat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        
        <radialGradient id="battery-heat" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
             <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
             <stop offset="100%" stopColor="#f91880" stopOpacity="0.2" />
        </radialGradient>

        <filter id="glow-soft">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>

        <filter id="vortex-blur">
            <feGaussianBlur stdDeviation="1" />
        </filter>

        <path id="flow-path-left" d="M100 -100 Q 110 300 80 900" />
        <path id="flow-path-right" d="M300 -100 Q 290 300 320 900" />
        
        {/* ERS Flow Paths */}
        <path id="ers-harvest-left" d={`M${200 - trackWidthHalf} ${wheelY_Rear} Q 180 600 200 680`} />
        <path id="ers-harvest-right" d={`M${200 + trackWidthHalf} ${wheelY_Rear} Q 220 600 200 680`} />
        
        {/* Dash array mask for animations */}
        <mask id="flow-mask">
            <rect x="0" y="0" width="400" height="900" fill="white" />
        </mask>
      </defs>

      <g>
          {/* --- LAYER 1: FLOOR & DIFFUSER --- */}
          <g transform={`translate(0, ${diveOffset * 0.2})`}>
             <path d="M160 150 L 240 150 L 240 700 L 160 700 Z" fill="#111" />
             <g fill="url(#carbon-fibre)" stroke="#222" strokeWidth="0.5" opacity={bodyOpacity}>
                {/* Main Floor Body */}
                <path d="M160 150 L 100 160 C 90 250, 80 400, 100 550 L 160 600" />
                <path d="M100 350 Q 85 400 100 480" fill="none" stroke="#333" strokeWidth="1" />
                
                <path d="M240 150 L 300 160 C 310 250, 320 400, 300 550 L 240 600" />
                <path d="M300 350 Q 315 400 300 480" fill="none" stroke="#333" strokeWidth="1" />
             </g>

             {/* Floor Scrolls (Edge Wings) */}
             <path d="M100 350 Q 90 400 100 450 L 105 450 Q 95 400 105 350 Z" fill="#222" stroke="#444" strokeWidth="0.5" opacity={bodyOpacity} />
             <path d="M300 350 Q 310 400 300 450 L 295 450 Q 305 400 295 350 Z" fill="#222" stroke="#444" strokeWidth="0.5" opacity={bodyOpacity} />
             
             {/* Floor Fences (Bargeboard Area) */}
             <g stroke="#00ba7c" strokeWidth="0.5" opacity={mode === 'AERO' ? 1 : 0.6}>
                 {/* Left Fences */}
                 <path d="M125 140 Q 120 160 128 180" fill="none" />
                 <path d="M135 142 Q 130 162 138 182" fill="none" />
                 <path d="M145 144 Q 140 164 148 184" fill="none" />
                 
                 {/* Right Fences */}
                 <path d="M275 140 Q 280 160 272 180" fill="none" />
                 <path d="M265 142 Q 270 162 262 182" fill="none" />
                 <path d="M255 144 Q 260 164 252 184" fill="none" />
             </g>

             {/* Diffuser Section */}
             <g transform="translate(0, 680)">
                 <path d="M120 20 L 280 20 L 300 100 L 100 100 Z" fill={mode === 'AERO' ? 'url(#pressure-field)' : 'url(#grid-micro)'} stroke="#333" strokeWidth="1" opacity={0.5} />
             </g>
             
             {/* Floor Edge Vortices */}
             <g opacity={mode === 'AERO' ? 0.8 : 0.4}>
                 <path d="M90 200 Q 80 400 50 600" stroke="#1d9bf0" strokeWidth={mode === 'AERO' ? 2 : 1} strokeDasharray="5 5" fill="none" />
                 <path d="M310 200 Q 320 400 350 600" stroke="#1d9bf0" strokeWidth={mode === 'AERO' ? 2 : 1} strokeDasharray="5 5" fill="none" />
             </g>
          </g>

          {/* --- LAYER 2: SUSPENSION --- */}
          <g opacity={mechOpacity}>
             <g stroke="url(#carbon-fibre)" strokeWidth="3" strokeLinecap="round">
                 <line x1={200 - chassisAttachX_Front} y1={150} x2={200 - trackWidthHalf + suspOffsetLeft} y2={wheelY_Front - 5} />
                 <line x1={200 - chassisAttachX_Front} y1={170} x2={200 - trackWidthHalf + suspOffsetLeft} y2={wheelY_Front + 5} />
                 <line x1={200 + chassisAttachX_Front} y1={150} x2={200 + trackWidthHalf + suspOffsetRight} y2={wheelY_Front - 5} />
                 <line x1={200 + chassisAttachX_Front} y1={170} x2={200 + trackWidthHalf + suspOffsetRight} y2={wheelY_Front + 5} />
             </g>

             <g stroke="url(#carbon-fibre)" strokeWidth="3" strokeLinecap="round">
                 <line x1={200 - chassisAttachX_Rear} y1={560} x2={200 - trackWidthHalf} y2={wheelY_Rear - 5} />
                 <line x1={200 - chassisAttachX_Rear} y1={580} x2={200 - trackWidthHalf} y2={wheelY_Rear + 5} />
                 <line x1={200 + chassisAttachX_Rear} y1={560} x2={200 + trackWidthHalf} y2={wheelY_Rear - 5} />
                 <line x1={200 + chassisAttachX_Rear} y1={580} x2={200 + trackWidthHalf} y2={wheelY_Rear + 5} />
             </g>
          </g>

          {/* --- LAYER 3: WHEELS & BRAKES --- */}
          {[
            { x: 200 - trackWidthHalf + suspOffsetLeft, y: wheelY_Front, rot: steeringAngle, id: 'FL' },
            { x: 200 + trackWidthHalf + suspOffsetRight, y: wheelY_Front, rot: steeringAngle, id: 'FR' },
            { x: 200 - trackWidthHalf, y: wheelY_Rear, rot: 0, id: 'RL' },
            { x: 200 + trackWidthHalf, y: wheelY_Rear, rot: 0, id: 'RR' },
          ].map((wheel) => {
            const isMoving = velocity > 10;
            const isLeft = wheel.id.includes('L');
            return (
            <g key={wheel.id} transform={`translate(${wheel.x}, ${wheel.y}) rotate(${wheel.rot})`}>
                {/* Brake Duct "Cake Tin" */}
                <path d="M-18 -30 L18 -30 L22 30 L-22 30 Z" fill={mode === 'THM' ? (brakeTemp > 500 ? '#f91880' : '#3b82f6') : "#111"} stroke="#333" strokeWidth="0.5" opacity={0.9} />
                
                <circle r="22" fill="none" stroke={brakeTemp > 650 || mode === 'THM' ? '#f91880' : 'transparent'} strokeWidth="4" filter="url(#glow-soft)" opacity={mode === 'THM' ? 0.8 : 0.6} />
                <circle r="20" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
                
                <g transform="translate(-24, -45)">
                    <TireZone x={0} y={0} width={16} height={90} temp={wheel.id.includes('L') ? tempOuter : tempInner} mode={mode} />
                    <TireZone x={16} y={0} width={16} height={90} temp={tempMiddle} mode={mode} />
                    <TireZone x={32} y={0} width={16} height={90} temp={wheel.id.includes('L') ? tempInner : tempOuter} mode={mode} />
                    <rect x="0" y="0" width="48" height="90" rx="4" fill="none" stroke="#222" strokeWidth="2" />
                    
                    {/* Only show wear texture in STD mode */}
                    {mode === 'STD' && (
                        <rect x="0" y="0" width="48" height="90" rx="4" fill="url(#wear-texture)" fillOpacity={wearFactor} stroke="none" style={{ mixBlendMode: 'multiply' }} />
                    )}
                </g>

                {mode === 'STD' && isMoving ? (
                    <circle r="16" fill="url(#motion-blur-wheel)" stroke="#222" strokeWidth="0.5" />
                ) : (
                    <g opacity={mode === 'THM' ? 0.2 : 1}>
                       <circle r="16" fill="none" stroke="#222" strokeWidth="2" />
                       {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(angle => (
                           <line key={angle} x1="0" y1="0" x2="0" y2="-16" stroke="#444" strokeWidth="1.5" transform={`rotate(${angle})`} />
                       ))}
                       <circle r="4" fill="#333" />
                    </g>
                )}
            </g>
          )})}

          {/* --- LAYER 4: ERS FLOW --- */}
          {mode === 'STD' && (
              <g>
                  {harvesting && (
                      <g stroke="#00ba7c" strokeWidth="3" fill="none" strokeDasharray="10 10">
                          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.5s" repeatCount="indefinite" />
                          <path d={`M${200 - trackWidthHalf} ${wheelY_Rear} Q 180 600 200 680`} filter="url(#glow-soft)" />
                          <path d={`M${200 + trackWidthHalf} ${wheelY_Rear} Q 220 600 200 680`} filter="url(#glow-soft)" />
                      </g>
                  )}
                  {deploying && (
                      <g stroke="#f91880" strokeWidth="3" fill="none" strokeDasharray="10 10">
                          <animate attributeName="stroke-dashoffset" from="0" to="100" dur="0.2s" repeatCount="indefinite" />
                          <path d={`M${200 - trackWidthHalf} ${wheelY_Rear} Q 180 600 200 680`} filter="url(#glow-soft)" />
                          <path d={`M${200 + trackWidthHalf} ${wheelY_Rear} Q 220 600 200 680`} filter="url(#glow-soft)" />
                      </g>
                  )}
              </g>
          )}

          {/* --- LAYER 5: CHASSIS & BODYWORK --- */}
          <g transform={`translate(0, ${diveOffset * 0.5})`}>
              
              {/* Nose Cone */}
              <path d="M190 20 L 210 20 L 215 130 L 185 130 Z" fill="url(#body-gradient)" stroke="#222" strokeWidth="0.5" opacity={bodyOpacity} />
              
              {/* Sidepods */}
              <path d="M175 140 L 135 150 C 130 250, 160 400, 185 500 L 175 140" fill="url(#body-gradient)" stroke="#222" strokeWidth="0.5" opacity={bodyOpacity} />
              <path d="M225 140 L 265 150 C 270 250, 240 400, 215 500 L 225 140" fill="url(#body-gradient)" stroke="#222" strokeWidth="0.5" opacity={bodyOpacity} />
              
              {/* Engine Cover */}
              <path d="M185 130 L 215 130 L 220 500 C 220 580, 210 650, 200 670 C 190 650, 180 580, 180 500 Z" fill="url(#body-gradient)" stroke="#222" strokeWidth="0.5" opacity={bodyOpacity} />
              
              {/* Thermal View Internals (Simulated Engine Block Heat) */}
              {mode === 'THM' && (
                  <g>
                      {/* Engine Heat Source */}
                      <ellipse cx="200" cy="400" rx="30" ry="100" fill="url(#exhaust-heat)" filter="url(#glow-soft)" opacity="0.6" />
                      {/* Radiators */}
                      <rect x="140" y="200" width="30" height="80" rx="5" fill="#3b82f6" opacity="0.4" />
                      <rect x="230" y="200" width="30" height="80" rx="5" fill="#3b82f6" opacity="0.4" />
                  </g>
              )}

              {/* Cockpit Area */}
              <g transform="translate(200, 110)" opacity={mode === 'THM' ? 0.3 : 1}>
                  {/* Surround */}
                  <rect x="-15" y="-15" width="30" height="40" rx="10" fill="#222" stroke="#444" strokeWidth="1" />
                  {/* Helmet */}
                  <circle r="9" fill="#ffd400" stroke="#000" strokeWidth="0.5" /> 
              </g>

              {/* Exhaust & Rear Structure */}
              <g>
                 {/* Main Exhaust */}
                 <circle cx="200" cy="670" r="8" fill="#333" stroke="#555" strokeWidth="2" />
                 
                 {/* Battery Pack / MGU-K Area */}
                 <g transform="translate(200, 710)">
                     <rect x="-5" y="-15" width="10" height="30" rx="2" fill={mode === 'THM' ? 'url(#battery-heat)' : 'url(#carbon-fibre)'} stroke="#333" strokeWidth="0.5" />
                     {/* Rain Light */}
                     <g className={ersLevel < 20 ? "animate-pulse" : ""} opacity={mode === 'THM' ? 0.2 : 1}>
                        <circle cy="-8" r="2" fill="#f91880" />
                        <circle cy="0" r="2" fill="#f91880" />
                        <circle cy="8" r="2" fill="#f91880" />
                     </g>
                 </g>

                 {(rpm > 10000 || mode === 'THM') && (
                    <g opacity={0.6}>
                        <circle cx="200" cy="670" r="5" fill="url(#exhaust-heat)" filter="url(#glow-soft)" />
                    </g>
                 )}
              </g>
          </g>

          {/* --- LAYER 6: FRONT WING --- */}
          <g transform={`translate(0, ${diveOffset * 0.8})`}>
              <path d="M60 20 Q 200 40 340 20 L 330 45 Q 200 65 70 45 Z" fill={mode === 'THM' ? '#111' : '#111'} stroke="#333" strokeWidth="0.5" opacity={bodyOpacity} />
              
              <path d="M65 10 Q 200 30 335 10 L 330 35 Q 200 55 70 35 Z" fill="url(#pressure-field)" stroke="none" opacity={dfFactor + (mode === 'AERO' ? 0.4 : 0)} style={{ mixBlendMode: 'screen' }} />
              
              <g opacity={0.6} filter="url(#glow-soft)">
                 <path d="M100 -50 Q 110 50 120 150" stroke="url(#front-flow-grad)" strokeWidth={mode === 'AERO' ? 3 : 2} strokeDasharray="10 5" />
                 <path d="M300 -50 Q 290 50 280 150" stroke="url(#front-flow-grad)" strokeWidth={mode === 'AERO' ? 3 : 2} strokeDasharray="10 5" />
              </g>

              <g filter="url(#vortex-blur)" opacity={0.6}>
                 <circle r={mode === 'AERO' ? 5 : 3} fill="#fff" opacity={0.2}>
                    <animateMotion dur="0.8s" repeatCount="indefinite" path="M180 40 Q 160 100 120 200" />
                    <animate attributeName="opacity" values="0.3;0" dur="0.8s" repeatCount="indefinite" />
                 </circle>
              </g>
          </g>

          {/* --- LAYER 7: REAR WING (DRS) --- */}
          <g transform="translate(0, 740)">
             <path d="M85 -30 L 85 60 L 90 60 L 90 -30 Z" fill="#111" stroke="#333" opacity={bodyOpacity} />
             <path d="M315 -30 L 315 60 L 310 60 L 310 -30 Z" fill="#111" stroke="#333" opacity={bodyOpacity} />
             
             {/* Main Plane */}
             <path d="M90 35 C 150 50, 250 50, 310 35 L 310 55 C 250 70, 150 70, 90 55 Z" fill={mode === 'AERO' ? 'url(#pressure-field)' : '#181818'} stroke="#333" strokeWidth="0.5" opacity={mode === 'THM' ? 0.2 : 1} />

             <g style={{
                 transformBox: 'fill-box',
                 transformOrigin: '50% 90%', 
                 transform: drsOpen ? 'translateY(-15px) rotate(-12deg)' : 'translateY(0) rotate(0)',
                 transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
             }}>
                 <path d="M92 0 L 308 0 L 308 28 L 220 28 L 200 20 L 180 28 L 92 28 Z" fill="url(#carbon-fibre)" stroke={drsOpen ? "#00ba7c" : "#444"} strokeWidth={drsOpen ? 1 : 0.5} opacity={bodyOpacity} />
             </g>

             {drsOpen && (
               <g opacity={0.6} filter="url(#glow-soft)">
                  <line x1="140" y1="20" x2="140" y2="200" stroke="url(#drs-flow-grad)" strokeWidth={mode === 'AERO' ? 4 : 2} strokeDasharray="4 4" />
                  <line x1="260" y1="20" x2="260" y2="200" stroke="url(#drs-flow-grad)" strokeWidth={mode === 'AERO' ? 4 : 2} strokeDasharray="4 4" />
               </g>
             )}
          </g>

          {/* --- LAYER 8: FLOW PARTICLES --- */}
          <g opacity={0.3 + (dfFactor * 0.7) + (mode === 'AERO' ? 0.4 : 0)}>
              <circle r={mode === 'AERO' ? 2 : 1} fill="#1d9bf0">
                 <animateMotion dur={flowDur} repeatCount="indefinite" rotate="auto">
                    <mpath href="#flow-path-left" />
                 </animateMotion>
                 <animate attributeName="opacity" values="0.8;0.4;0" dur={flowDur} repeatCount="indefinite" />
              </circle>
              <circle r={mode === 'AERO' ? 2 : 1} fill="#1d9bf0">
                 <animateMotion dur={flowDur} repeatCount="indefinite" rotate="auto" begin="0.1s">
                    <mpath href="#flow-path-right" />
                 </animateMotion>
                 <animate attributeName="opacity" values="0.8;0.4;0" dur={flowDur} repeatCount="indefinite" />
              </circle>
          </g>
      </g>

      <g transform="translate(480, 50)">
             <circle r="30" fill="#0a0a0a" fillOpacity="0.8" stroke="#333" strokeWidth="1" />
             <line x1="-32" y1="0" x2="32" y2="0" stroke="#444" strokeWidth="0.5" />
             <line x1="0" y1="-32" x2="0" y2="32" stroke="#444" strokeWidth="0.5" />
             
             <path d={`M0 0 L${-latG * 30} ${longG * 30}`} stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.5" />
             <circle cx={-latG * 30} cy={longG * 30} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1" filter="url(#glow-soft)">
                 <animate attributeName="opacity" values="1;0.8;1" dur="1s" repeatCount="indefinite" />
             </circle>
             <text x={latG > 0 ? -35 : 35} y="2" textAnchor={latG > 0 ? "end" : "start"} fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                {Math.abs(gForceLat).toFixed(1)} G
             </text>
      </g>
    </svg>
  );
};

const CarVisualizer: React.FC<CarVisualizerProps> = ({ metrics, steeringAngle = 0, throttle = 0, brake = 0 }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('STD');
  
  // Helper to safely get metric value
  const getMetric = (name: string) => metrics.find(m => m.name === name)?.value || 0;

  return (
    <div className="w-full h-full bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center border border-scada-border group">
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] pointer-events-none"></div>

        {/* Main Visualization Container */}
        <div className="relative w-full h-full max-w-[500px] p-4 z-10 transition-transform duration-500 ease-out">
            <DigitalTwin 
                steeringAngle={steeringAngle}
                brakeTemp={getMetric('Brake Temp')}
                engineTemp={getMetric('Engine Temp')}
                tireTemp={90 + (getMetric('Velocity') / 10)} 
                tireWear={getMetric('Tire Wear')}
                ersLevel={getMetric('ERS Batt')}
                velocity={getMetric('Velocity')}
                rpm={getMetric('RPM')}
                downforce={getMetric('Downforce')}
                throttle={throttle}
                brake={brake}
                mode={viewMode}
            />
        </div>

        {/* Mode Toggles */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
            <button 
                onClick={() => setViewMode('STD')}
                className={`p-2 rounded-sm border transition-all ${viewMode === 'STD' ? 'bg-white/10 border-white text-white' : 'bg-black/50 border-white/10 text-zinc-500 hover:text-white'}`}
                title="Standard View"
            >
                <Layers size={14} />
            </button>
            <button 
                onClick={() => setViewMode('THM')}
                className={`p-2 rounded-sm border transition-all ${viewMode === 'THM' ? 'bg-scada-red/20 border-scada-red text-scada-red' : 'bg-black/50 border-white/10 text-zinc-500 hover:text-white'}`}
                title="Thermal View"
            >
                <Thermometer size={14} />
            </button>
            <button 
                onClick={() => setViewMode('AERO')}
                className={`p-2 rounded-sm border transition-all ${viewMode === 'AERO' ? 'bg-scada-blue/20 border-scada-blue text-scada-blue' : 'bg-black/50 border-white/10 text-zinc-500 hover:text-white'}`}
                title="Aerodynamic View"
            >
                <Wind size={14} />
            </button>
        </div>

        {/* ERS Status Overlay (Only in STD mode) */}
        {viewMode === 'STD' && (
             <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${brake > 5 ? 'bg-scada-green animate-pulse' : 'bg-zinc-800'}`}></div>
                     <span className={`text-[9px] font-mono ${brake > 5 ? 'text-scada-green' : 'text-zinc-600'}`}>HARVEST</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${throttle > 80 ? 'bg-scada-red animate-pulse' : 'bg-zinc-800'}`}></div>
                     <span className={`text-[9px] font-mono ${throttle > 80 ? 'text-scada-red' : 'text-zinc-600'}`}>DEPLOY</span>
                 </div>
             </div>
        )}
    </div>
  );
};

export default React.memo(CarVisualizer);