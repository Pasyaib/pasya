import React from 'react';
import { Gauge, Activity, Zap, Thermometer, Disc, Wind } from 'lucide-react';
import { SystemMetric, Status } from '../types';

interface HealthMatrixProps {
  metrics: SystemMetric[];
  cols?: number; // Optional prop to control grid columns
}

const HealthCard: React.FC<{ metric: SystemMetric }> = ({ metric }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Velocity': return <Gauge className="w-4 h-4" />;
      case 'RPM': return <Activity className="w-4 h-4" />;
      case 'ERS Batt': return <Zap className="w-4 h-4" />;
      case 'Brake Temp': return <Thermometer className="w-4 h-4" />;
      case 'Tire Wear': return <Disc className="w-4 h-4" />;
      case 'Downforce': return <Wind className="w-4 h-4" />;
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
    <div className={`bg-black border ${borderColor} p-2 flex flex-col justify-between h-full w-full relative transition-all duration-300 hover:bg-white/5 group min-h-0`}>
      <div className="flex justify-between items-start shrink-0">
        <div className="flex items-center gap-2 text-scada-text group-hover:text-white transition-colors">
          {getIcon(metric.name)}
          <span className="text-xs font-medium uppercase tracking-wide truncate">{metric.name}</span>
        </div>
        {!isNominal && (
           <span className={`w-1.5 h-1.5 rounded-full ${metric.status === Status.WARNING ? 'bg-scada-amber' : 'bg-scada-red'} animate-pulse shrink-0`} />
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-1 flex-1 content-center">
        <span className={`text-2xl xl:text-3xl font-mono font-light tracking-tighter ${valueColor}`}>
          {metric.value}
        </span>
        <span className="text-[10px] text-scada-text font-mono">{metric.unit}</span>
      </div>

      <div className="flex justify-between items-end text-[9px] font-mono text-scada-text uppercase shrink-0">
        <span className={metric.alarms > 0 ? 'text-scada-text' : 'opacity-0'}>
          ALERTS: {metric.alarms}
        </span>
        <span className="opacity-50 text-scada-blue">{metric.subValue}</span>
      </div>
    </div>
  );
};

const HealthMatrix: React.FC<HealthMatrixProps> = ({ metrics, cols }) => {
  // If cols is 1, use a vertical flex stack that adapts to height (no scroll)
  // Otherwise use a grid layout with potential scrolling
  const isVertical = cols === 1;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="text-xs font-mono text-scada-text uppercase mb-2 pl-1 shrink-0">
        Car Status
      </div>
      
      {isVertical ? (
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          {metrics.map(metric => (
            <div key={metric.id} className="flex-1 min-h-0">
              <HealthCard metric={metric} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto pr-1">
          {metrics.map(metric => (
            <div key={metric.id} className="h-32">
               <HealthCard metric={metric} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthMatrix;