import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Target, Users, Inbox, 
  Mail, BarChart3, Settings, Sparkles, X 
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/campaigns', label: 'Campaigns', icon: Target },
    { path: '/leads', label: 'Leads Master', icon: Users },
    { path: '/inbox', label: 'Inbox', icon: Inbox },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-slate-900 h-full p-6 flex flex-col border-r border-slate-800">
      {/* Header & Logo */}
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">MAPS.AI</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400">
          <X size={20} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `
              w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm
              ${isActive 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
            `}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Profile Summary */}
      <div className="mt-auto p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">JD</div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">John Doe</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pro Plan</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;