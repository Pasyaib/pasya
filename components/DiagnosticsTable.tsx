import React from 'react';
import { DiagnosticItem } from '../types';

interface DiagnosticsTableProps {
  data: DiagnosticItem[];
}

const DiagnosticsTable: React.FC<DiagnosticsTableProps> = ({ data }) => {
  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-scada-border">
        <h3 className="text-xs font-mono text-scada-text uppercase tracking-wide">
          Diagnostics
        </h3>
        <span className="text-[10px] text-scada-text font-mono opacity-50">SYNCED</span>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="text-scada-text border-b border-scada-border sticky top-0 bg-black z-10">
            <tr>
              <th className="p-3 font-normal text-[10px] uppercase tracking-wider">ID</th>
              <th className="p-3 font-normal text-[10px] uppercase tracking-wider">Unit</th>
              <th className="p-3 font-normal text-[10px] uppercase tracking-wider">Param</th>
              <th className="p-3 font-normal text-[10px] uppercase tracking-wider text-right">Val</th>
              <th className="p-3 font-normal text-[10px] uppercase tracking-wider text-right text-zinc-600">Ref</th>
              <th className="p-3 font-normal text-[10px] uppercase tracking-wider text-right">Dev</th>
              <th className="p-3 font-normal text-[10px] uppercase tracking-wider text-center">Stat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {data.map((row) => (
              <tr key={row.id} className="group hover:bg-white/5 transition-colors">
                <td className="p-3 text-scada-text group-hover:text-white">{row.id}</td>
                <td className="p-3 text-scada-text">{row.name}</td>
                <td className="p-3 text-scada-text">{row.parameter}</td>
                <td className={`p-3 text-right ${row.status === 'critical' ? 'text-scada-red' : 'text-white'}`}>
                  {row.current.toFixed(1)} <span className="text-[10px] text-zinc-700">{row.unit}</span>
                </td>
                <td className="p-3 text-right text-zinc-700">
                  {row.nominal.toFixed(0)}
                </td>
                <td className={`p-3 text-right ${row.status === 'critical' ? 'text-scada-red' : 'text-scada-text'}`}>
                  {row.deviation.toFixed(2)}%
                </td>
                <td className="p-3 flex justify-center items-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                      row.status === 'critical' ? 'bg-scada-red' : 
                      row.status === 'warning' ? 'bg-scada-amber' : 'bg-scada-border'
                  }`}></div>
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