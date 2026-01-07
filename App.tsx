import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HealthMatrix from './components/HealthMatrix';
import TelemetryPanel from './components/TelemetryPanel';
import DiagnosticsTable from './components/DiagnosticsTable';
import LapHistoryTable from './components/LapHistoryTable';
import CarVisualizer from './components/CarVisualizer';
import RaceStrategyAI from './components/RaceStrategyAI';
import WeatherWidget from './components/WeatherWidget';
import TrackMap from './components/TrackMap';
import PrimaryStats from './components/PrimaryStats';

import { 
  SYSTEM_METRICS, 
  TELEMETRY_CHANNELS, 
  DIAGNOSTICS_DATA, 
  LAP_DATA 
} from './constants';
import { TelemetryChannel } from './types';

const App: React.FC = () => {
  // Simulate live data slightly
  const [telemetry, setTelemetry] = useState<TelemetryChannel[]>(TELEMETRY_CHANNELS);
  const [metrics, setMetrics] = useState(SYSTEM_METRICS);
  
  // New State for Synchronized Cursor (Telemetry -> Track Map)
  const [telemetryCursor, setTelemetryCursor] = useState<number | null>(null);

  // Effect to animate values slightly to give a "live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      // Animate telemetry charts
      setTelemetry(prev => prev.map(channel => {
        const lastValue = channel.data[channel.data.length - 1].value;
        const variance = lastValue * 0.02; // 2% variance
        const newValue = lastValue + (Math.random() * variance * 2 - variance);
        
        // Rolling buffer update
        const newData = [...channel.data.slice(1), { time: 'now', value: newValue, threshold: channel.threshold }];
        
        return {
          ...channel,
          currentValue: Number(newValue.toFixed(1)),
          data: newData
        };
      }));

      // Animate metrics occasionally
      setMetrics(prev => prev.map(m => {
         if (Math.random() > 0.7) {
            const variance = m.value * 0.01;
            return { ...m, value: Math.round(m.value + (Math.random() * variance * 2 - variance)) };
         }
         return m;
      }));

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Extract key metrics
  const velocity = metrics.find(m => m.name === 'Velocity')?.value || 0;
  const rpm = metrics.find(m => m.name === 'RPM')?.value || 0;
  const ersLevel = metrics.find(m => m.name === 'ERS Batt')?.value || 0;

  // Extract current steering angle
  const steeringAngle = telemetry.find(c => c.id === 't4')?.currentValue || 0;
  const throttle = telemetry.find(c => c.id === 't2')?.currentValue || 0;
  const brake = telemetry.find(c => c.id === 't3')?.currentValue || 0;

  // Calculate cursor progress (0 to 1) for the track map
  // Assumes fixed data length of 50 from constants
  const cursorProgress = telemetryCursor !== null ? telemetryCursor / 49 : null;

  return (
    <div className="flex h-screen bg-scada-bg font-mono text-scada-text overflow-hidden selection:bg-scada-green selection:text-black">
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        
        <main className="flex-1 p-4 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
            <div className="h-[260px] shrink-0">
               <PrimaryStats 
                 velocity={velocity} 
                 rpm={rpm} 
                 ersLevel={ersLevel} 
                 throttle={throttle}
                 brake={brake}
               />
            </div>

            <div className="h-[140px] shrink-0">
               <WeatherWidget />
            </div>
            
            {/* Split remaining space between Diagnostics and AI Strategy */}
            <div className="flex-1 min-h-0 flex flex-col gap-4">
                <div className="flex-1 min-h-0">
                    <DiagnosticsTable data={DIAGNOSTICS_DATA} />
                </div>
                {/* AI Replaces StressLevel */}
                <div className="h-[220px] shrink-0">
                    <RaceStrategyAI 
                        metrics={metrics} 
                        laps={LAP_DATA}
                        gapAhead="12.4"
                        gapBehind="0.8"
                    />
                </div>
            </div>
          </div>
          
          {/* Center Column: Full Height Car Visualization */}
          <div className="lg:col-span-6 h-full overflow-hidden">
            <CarVisualizer 
              metrics={metrics} 
              steeringAngle={steeringAngle} 
              throttle={throttle}
              brake={brake}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
             {/* Map Status at Top - Receives Cursor */}
             <div className="h-[240px] shrink-0">
                <TrackMap cursorProgress={cursorProgress} />
             </div>

             {/* Telemetry Charts - Sends Cursor */}
             <div className="flex-1 min-h-0">
               <TelemetryPanel 
                 channels={telemetry} 
                 onCursorChange={setTelemetryCursor}
               />
             </div>

             {/* Lap History */}
             <div className="h-[35%] min-h-[200px]">
               <LapHistoryTable laps={LAP_DATA} />
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;