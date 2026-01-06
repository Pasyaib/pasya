import React from 'react';
import { Gauge, Activity, Zap, ShieldCheck, Radio, CloudLightning } from 'lucide-react';
import { SystemMetric, Status } from '../types';

interface HealthMatrixProps {
  metrics: SystemMetric[];
}

const HealthCard: React.FC<{ metric: SystemMetric }> = ({ metric }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Drilling': return <Gauge className="w-4 h-4" />;
      case 'Pumps': return <Activity className="w-4 h-4" />;
      case 'Power Gen': return <Zap className="w-4 h-4" />;
      case 'Safety Sys': return <ShieldCheck className="w-4 h-4" />;
      case 'Comms': return <Radio className="w-4 h-4" />;
      case 'Electrical': return <CloudLightning className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Minimal logic: Only show color if not nominal
  const isNominal = metric.status === Status.NOMINAL;
  
  const valueColor = isNominal ? 'text-white' : 
    metric.status === Status.WARNING ? 'text-scada-amber' : 'text-scada-red';

  const borderColor = isNominal ? 'border-scada-border' : 
     metric.status === Status.WARNING ? 'border-scada-amber' : 'border-scada-red';

  return (
    <div className={`bg-black border ${borderColor} p-4 flex flex-col justify-between h-32 relative transition-all duration-300 hover:bg-white/5`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-scada-text">
          {getIcon(metric.name)}
          <span className="text-xs font-medium uppercase tracking-wide">{metric.name}</span>
        </div>
        {!isNominal && (
           <span className={`w-2 h-2 rounded-full ${metric.status === Status.WARNING ? 'bg-scada-amber' : 'bg-scada-red'} animate-pulse`} />
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-4xl font-mono font-light tracking-tighter ${valueColor}`}>
          {metric.value}
        </span>
        <span className="text-xs text-scada-text font-mono">%</span>
      </div>

      <div className="flex justify-between items-end text-[10px] font-mono text-scada-text uppercase mt-auto">
        <span className={metric.alarms > 0 ? 'text-scada-text' : 'opacity-0'}>
          ALERTS: {metric.alarms}
        </span>
        <span className="opacity-50">{metric.uptimeHours}H UP</span>
      </div>
    </div>
  );
};

const HealthMatrix: React.FC<HealthMatrixProps> = ({ metrics }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-xs font-mono text-scada-text uppercase mb-3 pl-1">
        Overview
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {metrics.map(metric => (
          <HealthCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
};

export default HealthMatrix;