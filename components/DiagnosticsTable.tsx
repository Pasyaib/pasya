import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { DiagnosticItem } from '../types';

interface DiagnosticsTableProps {
  data: DiagnosticItem[];
}

const DiagnosticsTable: React.FC<DiagnosticsTableProps> = ({ data }) => {
  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b border-scada-border shrink-0">
        <h3 className="text-xs font-mono text-scada-text uppercase tracking-wide">
          Diagnostics
        </h3>
        <span className="text-[10px] text-scada-text font-mono opacity-50">FULL TELEMETRY</span>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-left font-mono text-[9px] whitespace-nowrap relative">
          <thead className="text-scada-text border-b border-zinc-900 sticky top-0 bg-black z-10 shadow-sm shadow-black">
            <tr>
              <th className="py-2 pl-2 font-semibold uppercase tracking-wider w-[20%]">Subsystem</th>
              <th className="py-2 font-semibold uppercase tracking-wider w-[25%]">Param</th>
              <th className="py-2 text-right font-semibold uppercase tracking-wider w-[15%]">Act</th>
              <th className="py-2 text-right font-semibold uppercase tracking-wider text-zinc-600 w-[15%]">Nom</th>
              <th className="py-2 text-right font-semibold uppercase tracking-wider w-[15%]">Dev</th>
              <th className="py-2 pr-2 text-center font-semibold uppercase tracking-wider w-[10%]">St</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {data.map((row) => (
              <tr key={row.id} className="group hover:bg-white/5 transition-colors">
                <td className="py-1.5 pl-2 align-middle">
                    <div className="text-white font-medium tracking-tight">{row.id}</div>
                    <div className="text-[8px] text-scada-text uppercase truncate max-w-[80px]">{row.name}</div>
                </td>
                <td className="py-1.5 align-middle text-zinc-300">
                    <div className="truncate max-w-[100px]">{row.parameter}</div>
                    <div className="text-[8px] text-zinc-600 font-medium">TOL: {row.tolerance}</div>
                </td>
                <td className={`py-1.5 text-right align-middle font-medium ${row.status === 'critical' ? 'text-scada-red' : 'text-white'}`}>
                  {row.current.toFixed(1)}
                  <span className="text-[8px] text-zinc-500 ml-0.5">{row.unit}</span>
                </td>
                <td className="py-1.5 text-right align-middle text-zinc-600">
                  {row.nominal.toFixed(1)}
                </td>
                <td className={`py-1.5 text-right align-middle ${Math.abs(row.deviation) > 5 ? 'text-scada-amber' : 'text-zinc-500'}`}>
                  {row.deviation > 0 ? '+' : ''}{row.deviation.toFixed(1)}%
                </td>
                <td className="py-1.5 pr-2 text-center align-middle">
                  {row.status === 'critical' ? (
                     <AlertTriangle size={10} className="text-scada-red animate-pulse mx-auto" />
                  ) : row.status === 'warning' ? (
                     <AlertCircle size={10} className="text-scada-amber mx-auto" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-scada-green mx-auto opacity-50 shadow-[0_0_5px_rgba(0,186,124,0.5)]"></div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiagnosticsTable;