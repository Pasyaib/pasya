import React from 'react';
import { AlarmItem } from '../types';
import { AlertTriangle, Info, AlertCircle, X, ArrowRight } from 'lucide-react';

interface AlarmConsoleProps {
  alarms: AlarmItem[];
}

const AlarmRow: React.FC<{ alarm: AlarmItem }> = ({ alarm }) => {
  const isCrit = alarm.severity === 'CRIT';
  const isWarn = alarm.severity === 'WARN';

  const icon = 
    isCrit ? <AlertTriangle size={12} className="text-scada-red" /> : 
    isWarn ? <AlertCircle size={12} className="text-scada-amber" /> : 
    <Info size={12} className="text-scada-blue" />;

  const textColor = isCrit ? 'text-scada-red' : isWarn ? 'text-scada-amber' : 'text-scada-blue';

  return (
    <div className={`flex items-center text-xs font-mono border-b border-zinc-900 hover:bg-white/5 transition-colors group py-3 px-2`}>
      <div className="w-8 shrink-0 flex justify-center opacity-70 group-hover:opacity-100">
        {icon}
      </div>
      <div className="w-24 text-zinc-600 shrink-0 text-[10px]">{alarm.timestamp.split(' ')[1]}</div>
      <div className={`w-24 shrink-0 font-medium ${textColor} text-[10px]`}>{alarm.system}</div>
      <div className="flex-1 text-scada-text truncate pl-2 group-hover:text-white transition-colors">{alarm.message}</div>
      <div className="w-16 flex justify-end gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-scada-text hover:text-white">
            <X size={14} />
        </button>
      </div>
    </div>
  );
};

const AlarmConsole: React.FC<AlarmConsoleProps> = ({ alarms }) => {
  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-scada-border">
        <h3 className="text-xs font-mono text-scada-text uppercase tracking-wide">
          Events
        </h3>
        <span className="text-[10px] text-scada-text opacity-50 uppercase">Live Log</span>
      </div>
      
      <div className="flex-1 overflow-auto p-0">
        <div className="min-w-[400px]">
          {alarms.map(alarm => (
            <AlarmRow key={alarm.id} alarm={alarm} />
          ))}
        </div>
      </div>
      <div className="p-2 border-t border-scada-border text-center">
          <button className="text-[10px] text-scada-text hover:text-white flex items-center justify-center gap-1 w-full uppercase tracking-wider">
              View All History <ArrowRight size={10} />
          </button>
      </div>
    </div>
  );
};

export default AlarmConsole;