import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HealthMatrix from './components/HealthMatrix';
import TelemetryPanel from './components/TelemetryPanel';
import DiagnosticsTable from './components/DiagnosticsTable';
import LapHistoryTable from './components/LapHistoryTable';
import CarVisualizer from './components/CarVisualizer';
import StressLevel from './components/StressLevel';

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

  // Effect to animate values slightly to give a "live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      // Animate telemetry charts
      setTelemetry(prev => prev.map(channel => {
        const lastValue = channel.data[channel.data.length - 1].value;
        const variance = lastValue * 0.02; // 2% variance
        const newValue = lastValue + (Math.random() * variance * 2 - variance);
        
        return {
          ...channel,
          currentValue: Number(newValue.toFixed(1)),
          data: [
             ...channel.data.slice(1), 
             { time: 'now', value: newValue, threshold: channel.threshold }
          ]
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

  // Split metrics for layout
  // We put the most dynamic/numeric ones in the sidebar/left panel
  const sidebarMetrics = metrics.slice(0, 3); // Velocity, RPM, ERS

  // Extract current steering angle from telemetry
  // 't4' is the ID for Steering Angle in constants.ts
  const steeringAngle = telemetry.find(c => c.id === 't4')?.currentValue || 0;

  return (
    <div className="flex h-screen bg-scada-bg font-mono text-scada-text overflow-hidden selection:bg-scada-green selection:text-black">
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        
        <main className="flex-1 p-4 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Key Metrics, Diagnostics & Stress */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
            {/* Fixed height for Status Cards to ensure they don't get squashed */}
            <div className="h-[260px] shrink-0">
               <HealthMatrix metrics={sidebarMetrics} cols={1} />
            </div>
            
            {/* Diagnostics fills the remaining space */}
            <div className="flex-1 min-h-0">
               <DiagnosticsTable data={DIAGNOSTICS_DATA} />
            </div>

            {/* Fixed small height for the simple stress bar */}
            <div className="h-[110px] shrink-0">
               <StressLevel />
            </div>
          </div>
          
          {/* Center Column: Full Height Car Visualization */}
          <div className="lg:col-span-6 h-full overflow-hidden">
            <CarVisualizer metrics={metrics} steeringAngle={steeringAngle} />
          </div>

          {/* Right Column: Telemetry & Lap Timing */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
             <div className="h-[50%] min-h-[300px]">
               <TelemetryPanel channels={telemetry} />
             </div>
             <div className="flex-1 min-h-0">
               <LapHistoryTable laps={LAP_DATA} />
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;