import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Play, RefreshCw, Mail, CheckCircle, Phone, Globe,
  MessageCircle, Download, ExternalLink, Zap, Target, Users, 
  BarChart3, Hash, AlertCircle, Search,
  Instagram
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const CampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchCampaign();
    const interval = setInterval(fetchCampaign, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns/${id}`);
      setCampaign(response.data.campaign);
      setLeads(response.data.leads);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setLoading(false);
    }
  };

  const deleteCampaign = async () => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/campaigns/${id}`);
      navigate('/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleAnalyze = async () => {
    setActionLoading(true);
    try {
      const response = await axios.post(`${API_URL}/scraper/analyze/${id}`);
      fetchCampaign();
    } catch (error) {
      console.error('Analysis failed');
    }
    setActionLoading(false);
  };

  const handleSendEmails = async () => {
    const emailLeads = leads.filter(l => l.isQualified && !l.outreach?.email?.sent && l.email);
    if (!window.confirm(`Send emails to ${emailLeads.length} leads?`)) return;
    
    setActionLoading(true);
    try {
      await axios.post(`${API_URL}/campaigns/${id}/send`);
      fetchCampaign();
    } catch (error) {
      console.error('Email send failed');
    }
    setActionLoading(false);
  };

  const getFilteredLeads = () => {
    switch (activeTab) {
      case 'qualified': return leads.filter(l => l.isQualified);
      case 'email': return leads.filter(l => l.email);
      case 'phone': return leads.filter(l => l.phone || l.whatsapp);
      default: return leads;
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center animate-pulse text-blue-600 font-medium text-sm tracking-widest uppercase">Syncing Campaign Data...</div>;
  if (!campaign) return null;

  const filteredLeads = getFilteredLeads();

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-8">
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{campaign.name}</h1>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="text-slate-500 text-sm font-medium">{campaign.niche} • {campaign.location}</p>
        </div>

        <div className="flex items-center gap-3">
          {campaign.status === 'analyzing' && (
            <button
              onClick={handleAnalyze}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 text-blue-500 ${actionLoading || campaign.status === 'analyzing' ? 'animate-spin' : ''}`} />
              Re-Analyze
            </button>
          )}
          <button
            onClick={handleSendEmails}
            disabled={actionLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            <Mail className="h-4 w-4" />
            Launch Outreach
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
            onClick={deleteCampaign}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={leads.length} icon={Users} color="text-slate-600" />
        <StatCard title="Qualified" value={leads.filter(l => l.isQualified).length} icon={Target} color="text-emerald-600" />
        <StatCard title="Contactable" value={leads.filter(l => l.email).length} icon={Mail} color="text-blue-600" />
        <StatCard title="Success Rate" value={`${Math.round((leads.filter(l => l.isQualified).length / leads.length) * 100) || 0}%`} icon={BarChart3} color="text-violet-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/30">
          <nav className="flex space-x-8">
            {['all', 'qualified', 'email', 'phone'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="py-3">
             <button onClick={() => {}} className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2">
               <Download className="h-3.5 w-3.5" /> Export Data
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Business Entity</th>
                <th className="px-6 py-4 font-bold">Web Presence</th>
                <th className="px-6 py-4 font-bold">Outreach Channels</th>
                <th className="px-6 py-4 font-bold">AI Verdict</th>
                <th className="px-6 py-4 font-bold text-right">Direct Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${lead.isQualified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {lead.businessName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{lead.businessName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.website ? (
                      <div className="space-y-1">
                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Site Preview
                        </a>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${lead.websiteScore || 40}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{lead.websiteScore || 40}%</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-tighter">No Website Found</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex flex-wrap gap-2">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-600">
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600">
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      {lead.instagram && (
                        <a href={lead.instagram} target="_blank" rel="noreferrer" className="text-pink-600 hover:text-pink-800">
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.isQualified ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                        <span claszsName="text-xs font-bold uppercase tracking-tight">Qualified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-300">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-tight">Rejected</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm">
                        Message
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-slate-50 rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{title}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    scraping: "bg-blue-50 text-blue-700 border-blue-100",
    analyzing: "bg-amber-50 text-amber-700 border-amber-100",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    default: "bg-slate-50 text-slate-600 border-slate-100"
  };
  const activeStyle = styles[status] || styles.default;
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${activeStyle}`}>
      {status === 'analyzing' || status === 'scraping' ? (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-current rounded-full animate-pulse" />
          {status}
        </span>
      ) : status}
    </span>
  );
};

export default CampaignPage;