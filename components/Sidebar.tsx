import React from 'react';
import { LayoutDashboard, FileText, Zap, Database, BarChart2, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, active: true },
    { icon: FileText, active: false },
    { icon: Zap, active: false },
    { icon: Database, active: false },
    { icon: BarChart2, active: false },
    { icon: Settings, active: false },
  ];

  return (
    <aside className="w-16 h-full border-r border-scada-border bg-black flex flex-col items-center py-6 gap-6 z-10">
      <div className="text-white font-bold text-xl mb-6">
         {/* Minimal Logo */}
         <div className="w-6 h-6 border border-white flex items-center justify-center">
            <div className="w-1 h-1 bg-white"></div>
         </div>
      </div>
      
      {navItems.map((item, index) => (
        <button
          key={index}
          className={`p-3 rounded-full transition-all duration-200 ${
            item.active 
              ? 'text-white bg-white/10' 
              : 'text-scada-text hover:bg-white/5 hover:text-white'
          }`}
        >
          <item.icon size={22} strokeWidth={1.5} />
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;