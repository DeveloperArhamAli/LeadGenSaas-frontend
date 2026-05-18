import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, TrendingUp, Users, Target, 
  Mail, MousePointer2, Globe, MessageSquare, 
  ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In a real app, you'd have a specific /analytics endpoint
      const response = await axios.get(`${API_URL}/campaigns`);
      const campaigns = response.data;
      
      // Aggregating mock data from campaigns for demonstration
      const totalLeads = campaigns.reduce((acc, c) => acc + (c.stats?.totalLeads || 0), 0);
      const qualifiedLeads = campaigns.reduce((acc, c) => acc + (c.stats?.qualifiedLeads || 0), 0);
      const emailsSent = campaigns.reduce((acc, c) => acc + (c.stats?.emailsSent || 0), 0);
      
      setData({
        metrics: {
          totalLeads,
          qualifiedLeads,
          emailsSent,
          conversionRate: ((qualifiedLeads / totalLeads) * 100).toFixed(1) || 0
        },
        campaigns: campaigns.slice(0, 5) // Top 5 performing
      });
      setLoading(false);
    } catch (error) {
      console.error('Analytics fetch failed', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center text-blue-600 font-bold animate-pulse tracking-widest uppercase text-xs">Generating Reports...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-slate-500 text-sm font-medium">Cross-campaign performance and lead intelligence</p>
        </div>

        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {['24h', '7d', '30d', 'all'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                timeframe === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Leads Discovered" value={data.metrics.totalLeads} trend="+12.5%" icon={Users} color="blue" />
        <MetricCard title="Qualified by AI" value={data.metrics.qualifiedLeads} trend="+8.2%" icon={Target} color="emerald" />
        <MetricCard title="Outreach Sent" value={data.metrics.emailsSent} trend="+24.1%" icon={Mail} color="violet" />
        <MetricCard title="Avg. Qualification" value={`${data.metrics.conversionRate}%`} trend="-1.2%" icon={TrendingUp} color="amber" isNegative />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Quality Funnel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-4xl p-8 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" /> Lead Qualification Funnel
          </h3>
          
          <div className="space-y-6">
            <FunnelStep label="Scraped from Maps" value={data.metrics.totalLeads} percentage={100} color="bg-slate-100" />
            <FunnelStep label="Verified Contact Info" value={Math.floor(data.metrics.totalLeads * 0.8)} percentage={80} color="bg-blue-100" />
            <FunnelStep label="AI Qualified (No Website/Old Tech)" value={data.metrics.qualifiedLeads} percentage={data.metrics.conversionRate} color="bg-emerald-100" />
            <FunnelStep label="Outreach Response" value={Math.floor(data.metrics.qualifiedLeads * 0.1)} percentage={10} color="bg-violet-100" />
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-slate-900 rounded-4xl p-
        8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-8">Channel Effectiveness</h3>
            <div className="space-y-8">
              <ChannelProgress label="Email Outreach" value={74} icon={Mail} />
              <ChannelProgress label="WhatsApp Direct" value={42} icon={MessageSquare} />
              <ChannelProgress label="Instagram DM" value={28} icon={Globe} />
              <ChannelProgress label="Direct Calls" value={15} icon={Users} />
            </div>
            
            <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Top Performer</p>
              <p className="text-sm font-bold text-blue-400">Dentists in Kuwait City</p>
              <p className="text-[10px] text-slate-500 mt-1">14.2% Qualification Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const MetricCard = ({ title, value, trend, icon: Icon, color, isNegative }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    violet: "text-violet-600 bg-violet-50",
    amber: "text-amber-600 bg-amber-50"
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-4xl shadow-sm hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isNegative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {isNegative ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{title}</div>
    </div>
  );
};

const FunnelStep = ({ label, value, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <span className="text-xs font-black text-slate-900">{value} <span className="text-slate-400 font-medium ml-1">({percentage}%)</span></span>
    </div>
    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
    </div>
  </div>
);

const ChannelProgress = ({ label, value, icon: Icon }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />
        <span className="text-xs font-bold text-slate-300">{label}</span>
      </div>
      <span className="text-xs font-black text-white">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default AnalyticsPage;