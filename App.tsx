import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HealthMatrix from './components/HealthMatrix';
import TelemetryPanel from './components/TelemetryPanel';
import DiagnosticsTable from './components/DiagnosticsTable';
import AlarmConsole from './components/AlarmConsole';

import { 
  SYSTEM_METRICS, 
  TELEMETRY_CHANNELS, 
  DIAGNOSTICS_DATA, 
  ALARMS_DATA 
} from './constants';
import { TelemetryChannel } from './types';

const App: React.FC = () => {
  // Simulate live data slightly
  const [telemetry, setTelemetry] = useState<TelemetryChannel[]>(TELEMETRY_CHANNELS);

  // Effect to animate values slightly to give a "live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => prev.map(channel => {
        const lastValue = channel.data[channel.data.length - 1].value;
        const variance = lastValue * 0.02; // 2% variance
        const newValue = lastValue + (Math.random() * variance * 2 - variance);
        
        // Keep threshold static, but update current value display
        return {
          ...channel,
          currentValue: Number(newValue.toFixed(1)),
          // In a real app we'd push to data array and shift, but for this demo static array is fine or we create a new one
          // Let's just update the last point to make the chart look alive if we were re-rendering data
          data: [
             ...channel.data.slice(1), 
             { time: 'now', value: newValue, threshold: channel.threshold }
          ]
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-scada-bg font-mono text-scada-text overflow-hidden selection:bg-scada-green selection:text-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        
        <main className="flex-1 p-4 overflow-hidden flex flex-col gap-4">
          
          {/* Top Section: Health & Telemetry */}
          {/* Using a grid that gives slightly more space to health matrix on wide screens */}
          <div className="h-[45%] min-h-[300px] grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 h-full overflow-hidden">
              <HealthMatrix metrics={SYSTEM_METRICS} />
            </div>
            <div className="lg:col-span-5 h-full overflow-hidden">
              <TelemetryPanel channels={telemetry} />
            </div>
          </div>
          
          {/* Bottom Section: Diagnostics & Alarms */}
          <div className="flex-1 min-h-[300px] grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
             <div className="lg:col-span-7 h-full overflow-hidden">
               <DiagnosticsTable data={DIAGNOSTICS_DATA} />
             </div>
             <div className="lg:col-span-5 h-full overflow-hidden">
               <AlarmConsole alarms={ALARMS_DATA} />
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;