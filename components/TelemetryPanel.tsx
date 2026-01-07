import React from 'react';
import { LineChart, Line, ResponsiveContainer, ReferenceLine, Tooltip, XAxis } from 'recharts';
import { TelemetryChannel } from '../types';

interface TelemetryPanelProps {
  channels: TelemetryChannel[];
  onCursorChange?: (index: number | null) => void;
}

const ChartCard: React.FC<{ channel: TelemetryChannel, onCursorChange?: (index: number | null) => void }> = ({ channel, onCursorChange }) => {
  return (
    <div className="bg-black border border-scada-border p-2 flex flex-col h-full relative group hover:border-scada-text transition-colors min-h-0">
      <div className="flex justify-between items-center mb-1 shrink-0">
        <span className="text-[10px] font-mono text-scada-text uppercase tracking-wide group-hover:text-white transition-colors truncate">
          {channel.name}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-mono font-medium text-white">
            {channel.currentValue}
          </span>
          <span className="text-[9px] text-scada-text font-mono">{channel.unit}</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={channel.data} 
            syncId="telemetry"
            onMouseMove={(state) => {
                if (state.activeTooltipIndex !== undefined && onCursorChange) {
                    onCursorChange(state.activeTooltipIndex);
                }
            }}
            onMouseLeave={() => {
                if (onCursorChange) onCursorChange(null);
            }}
          >
            <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} 
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '3 3' }}
                isAnimationActive={false}
            />
            <ReferenceLine y={channel.threshold} stroke="#333" strokeDasharray="2 2" />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={channel.color} 
              strokeWidth={1.5} 
              dot={false}
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ channels, onCursorChange }) => {
  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b border-scada-border shrink-0">
        <h3 className="text-xs font-mono text-scada-text uppercase tracking-wide">
          Telemetry
        </h3>
        <span className="text-[10px] text-scada-text opacity-50 uppercase">SYNC: ACTIVE</span>
      </div>
      
      <div className="flex-1 flex flex-col p-2 gap-2 min-h-0">
        {channels.map(channel => (
          <div key={channel.id} className="flex-1 min-h-0">
            <ChartCard channel={channel} onCursorChange={onCursorChange} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelemetryPanel;