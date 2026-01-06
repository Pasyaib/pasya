import React from 'react';
import { LineChart, Line, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TelemetryChannel } from '../types';

interface TelemetryPanelProps {
  channels: TelemetryChannel[];
}

const ChartCard: React.FC<{ channel: TelemetryChannel }> = ({ channel }) => {
  // Desaturate colors slightly for the minimalist look, or stick to theme
  // We'll use the theme colors but keep the chart minimal
  
  return (
    <div className="bg-black border border-scada-border p-4 flex flex-col h-full relative group hover:border-scada-text transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-scada-text uppercase tracking-wide group-hover:text-white transition-colors">
          {channel.name}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-mono font-medium text-white">
            {channel.currentValue}
          </span>
          <span className="text-[10px] text-scada-text font-mono">{channel.unit}</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[60px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={channel.data}>
            <ReferenceLine y={channel.threshold} stroke="#333" strokeDasharray="2 2" />
            <Line 
              type="step" 
              dataKey="value" 
              stroke={channel.color} 
              strokeWidth={1.5} 
              dot={false}
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 flex justify-between items-center border-t border-zinc-900 pt-2">
         <span className="text-[10px] text-scada-text uppercase">Live Feed</span>
         <span className="text-[10px] font-mono text-zinc-700 uppercase">
           Max: {channel.threshold}
         </span>
      </div>
    </div>
  );
};

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ channels }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-xs font-mono text-scada-text uppercase mb-3 pl-1">
        Telemetry
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {channels.map(channel => (
          <ChartCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};

export default TelemetryPanel;