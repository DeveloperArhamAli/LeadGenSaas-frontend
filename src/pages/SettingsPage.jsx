import React, { useState } from 'react';
import { 
  Settings, User, Lock, Database, 
  Mail, Key, ShieldCheck, CreditCard, 
  Save, RefreshCw, Bell, Globe,
  Shield, CreditCard as CardIcon, LogOut,
  Activity, ExternalLink
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('integrations');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm font-medium">Configure your outreach engine and account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <NavButton 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')} 
            icon={User} 
            label="Account Profile" 
          />
          <NavButton 
            active={activeTab === 'integrations'} 
            onClick={() => setActiveTab('integrations')} 
            icon={Key} 
            label="API Integrations" 
          />
          <NavButton 
            active={activeTab === 'email'} 
            onClick={() => setActiveTab('email')} 
            icon={Mail} 
            label="SMTP Settings" 
          />
          <NavButton 
            active={activeTab === 'billing'} 
            onClick={() => setActiveTab('billing')} 
            icon={CreditCard} 
            label="Billing & Plan" 
          />
          <NavButton 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')} 
            icon={ShieldCheck} 
            label="Security" 
          />

          {/* System Health Sidebar Widget */}
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-2 mb-3">
                <Activity className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Health</span>
             </div>
             <div className="space-y-2">
                <HealthRow label="Maps Scraper" status="online" />
                <HealthRow label="OpenAI Node" status="online" />
                <HealthRow label="SMTP Relay" status="congested" />
             </div>
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-4xl p-8 shadow-sm min-h-150">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
          {activeTab === 'email' && <EmailTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
};

// --- Tab: General Profile ---
const GeneralTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <div>
      <h3 className="text-lg font-bold text-slate-900">Account Profile</h3>
      <p className="text-sm text-slate-500">Update your personal information and public identity.</p>
    </div>
    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
      <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black">
        JD
      </div>
      <div className="space-y-2">
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:shadow-sm transition-all">Change Avatar</button>
        <p className="text-[10px] text-slate-400 font-medium">JPG or PNG. Max size 2MB.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Full Name" placeholder="John Doe" />
      <SettingField label="Business Name" placeholder="Doe Marketing Agency" />
      <SettingField label="Contact Email" placeholder="john@doe.com" />
      <SettingField label="Timezone" placeholder="(GMT+03:00) Kuwait" />
    </div>
    <div className="pt-6 border-t border-slate-100 flex justify-end">
      <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg">Save Profile</button>
    </div>
  </div>
);

// --- Tab: Billing & Plan ---
const BillingTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <div className="p-8 bg-slate-900 rounded-4xl text-white relative overflow-hidden">
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Current Plan</p>
          <h2 className="text-3xl font-black">Pro Marketer</h2>
          <p className="text-slate-400 text-sm mt-2">Next billing date: <span className="text-white">March 12, 2026</span></p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black">$49<span className="text-sm font-normal text-slate-400">/mo</span></div>
          <button className="mt-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20 transition-all">Manage</button>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</h4>
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="h-10 w-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 italic font-bold text-xs uppercase">Visa</div>
          <div>
            <p className="text-sm font-bold text-slate-900">•••• •••• •••• 4242</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Expires 12/28</p>
          </div>
        </div>
        <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">Update</button>
      </div>
    </div>

    <div className="space-y-4">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lead Usage</h4>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="text-slate-500">Monthly Scraping Limit</span>
          <span className="text-slate-900">1,240 / 5,000</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600" style={{ width: '25%' }} />
        </div>
      </div>
    </div>
  </div>
);

// --- Tab: Security ---
const SecurityTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <div>
      <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
      <p className="text-sm text-slate-500">Manage your password and authentication preferences.</p>
    </div>

    <div className="space-y-6">
      <SettingField label="Current Password" type="password" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingField label="New Password" type="password" />
        <SettingField label="Confirm New Password" type="password" />
      </div>
    </div>

    <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
            <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
          </div>
        </div>
        <div className="h-6 w-11 bg-slate-200 rounded-full relative cursor-pointer">
           <div className="h-5 w-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm border border-slate-200" />
        </div>
      </div>
    </div>

    <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
      <button className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-widest hover:text-rose-600 transition-all">
        <LogOut className="h-4 w-4" />
        Sign out from all devices
      </button>
      <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all">Update Security</button>
    </div>
  </div>
);

// --- Previously Defined Tabs (Briefly Re-included for context) ---
const IntegrationsTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div>
        <h3 className="text-lg font-bold text-slate-900">API Configuration</h3>
        <p className="text-sm text-slate-500">Connect the services that power your scraping and AI analysis.</p>
      </div>
      <div className="space-y-6">
        <SettingField label="Google Maps API Key" type="password" placeholder="AIzaSy..." />
        <SettingField label="OpenAI API Key" type="password" placeholder="sk-..." />
      </div>
      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg">Save API Keys</button>
      </div>
    </div>
);

const EmailTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <h3 className="text-lg font-bold text-slate-900">Outgoing Mail Server</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingField label="SMTP Host" placeholder="smtp.gmail.com" />
        <SettingField label="SMTP Port" placeholder="587" />
        <SettingField label="Username" placeholder="yourname@gmail.com" />
        <SettingField label="Password" type="password" placeholder="••••••••" />
      </div>
      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg">Update SMTP</button>
      </div>
    </div>
);

// --- Reusable Components ---

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      active 
      ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
    {label}
  </button>
);

const SettingField = ({ label, description, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      {...props}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
    />
    {description && <p className="text-[10px] text-slate-400 font-medium ml-1 italic">{description}</p>}
  </div>
);

const HealthRow = ({ label, status }) => {
    const statusColor = status === 'online' ? 'bg-emerald-500' : status === 'congested' ? 'bg-amber-500' : 'bg-rose-500';
    return (
        <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-600 uppercase">{label}</span>
            <div className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
        </div>
    )
}

export default SettingsPage;