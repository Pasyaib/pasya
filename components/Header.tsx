import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const StatusItem: React.FC<{ label: string; status: 'good' | 'warn' | 'bad' }> = ({ label, status }) => {
  const textColor = 
    status === 'good' ? 'text-scada-text' : 
    status === 'warn' ? 'text-scada-amber' : 
    'text-scada-red';

  const dotColor = 
    status === 'good' ? 'bg-scada-text' : 
    status === 'warn' ? 'bg-scada-amber' : 
    'bg-scada-red';
    
  return (
    <div className="flex items-center gap-2 group cursor-default">
      <div className={`w-1.5 h-1.5 rounded-full ${dotColor} ${status !== 'good' ? 'animate-pulse' : 'opacity-50'}`} />
      <span className={`text-xs font-mono ${textColor} group-hover:text-white transition-colors`}>{label}</span>
    </div>
  );
};

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };

  return (
    <header className="h-12 border-b border-scada-border bg-black flex items-center justify-between px-6 select-none">
      <div className="flex items-center gap-8">
        <h1 className="text-sm font-mono font-bold tracking-tight text-white uppercase">
          Rig Alpha // <span className="text-scada-text font-normal">Dashboard</span>
        </h1>
        
        <div className="hidden md:flex items-center gap-6 border-l border-scada-border pl-6 h-6">
          <StatusItem label="SYSTEM" status="good" />
          <StatusItem label="NET" status="good" />
          <StatusItem label="PWR" status="warn" />
          <StatusItem label="SEC" status="good" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-scada-red animate-pulse">
            <Activity size={14} />
            <span className="text-xs font-bold tracking-wider">7 ALERTS</span>
        </div>
        <div className="text-xs font-mono text-scada-text">
          {formatTime(time)}
        </div>
      </div>
    </header>
  );
};

export default Header;