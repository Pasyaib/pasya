import React from 'react';
import { LapData } from '../types';

interface LapHistoryTableProps {
  laps: LapData[];
}

const LapHistoryTable: React.FC<LapHistoryTableProps> = ({ laps }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'purple': return 'text-fuchsia-500'; // Fastest
      case 'green': return 'text-scada-green';  // Personal Best
      case 'yellow': return 'text-scada-amber'; // Slower
      default: return 'text-zinc-500';          // Normal
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-scada-border shrink-0">
        <h3 className="text-xs font-mono text-scada-text uppercase tracking-wide">
          Timing Board
        </h3>
        <span className="text-[10px] text-scada-text opacity-50 uppercase">SECTOR ANALYSIS</span>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-left font-mono text-[10px] whitespace-nowrap">
          <thead className="text-scada-text border-b border-zinc-900 sticky top-0 bg-black z-10">
            <tr>
              <th className="py-2 pl-3 font-semibold uppercase w-[15%]">Lap</th>
              <th className="py-2 text-center font-semibold uppercase w-[15%]">S1</th>
              <th className="py-2 text-center font-semibold uppercase w-[15%]">S2</th>
              <th className="py-2 text-center font-semibold uppercase w-[15%]">S3</th>
              <th className="py-2 text-right font-semibold uppercase w-[25%]">Time</th>
              <th className="py-2 pr-3 text-right font-semibold uppercase w-[15%]">Tyre</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {laps.map((lap) => (
              <tr key={lap.lap} className="group hover:bg-white/5 transition-colors">
                <td className="py-1.5 pl-3 text-white font-medium">{lap.lap}</td>
                <td className={`py-1.5 text-center ${getStatusColor(lap.s1Status)}`}>{lap.s1}</td>
                <td className={`py-1.5 text-center ${getStatusColor(lap.s2Status)}`}>{lap.s2}</td>
                <td className={`py-1.5 text-center ${getStatusColor(lap.s3Status)}`}>{lap.s3}</td>
                <td className="py-1.5 text-right font-bold text-white">{lap.lapTime}</td>
                <td className="py-1.5 pr-3 text-right text-zinc-400">{lap.tyre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-2 border-t border-scada-border flex justify-between items-center shrink-0 text-[9px] font-mono text-scada-text">
         <span>DELTA: <span className="text-scada-green">-0.102</span></span>
         <span>PB: 1:22.653</span>
      </div>
    </div>
  );
};

export default LapHistoryTable;