import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, Settings, LogOut, CreditCard, Menu } from 'lucide-react';
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-72 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-14">
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">

        <div className="flex items-center gap-4 flex-1">
          <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          
          <div className="hidden md:flex relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Quick search... (⌘ + K)"
              className="w-full bg-slate-100 border-transparent border focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-1.5 pl-10 pr-4 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 md:pr-3 rounded-full border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-200">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 hidden sm:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              <div></div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500 font-bold">{user.email}</p>
                </div>
                <MenuLink to="/settings" icon={<Settings size={14} />} label="Settings" />
                <MenuLink to="/billing" icon={<CreditCard size={14} />} label="Billing" />
                <div className="border-t border-slate-50 mt-1 pt-1">
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 font-bold" onClick={logout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const MenuLink = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold transition-colors">
    {icon}
    {label}
  </Link>
);

export default Navbar;