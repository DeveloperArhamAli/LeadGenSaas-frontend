import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Play, RefreshCw, Mail, CheckCircle, Phone, Globe,
  MessageCircle, Download, ExternalLink, Zap, Target, Users, 
  BarChart3, Hash, AlertCircle, Search, Filter, X, 
  TrendingUp, Clock, Award, Shield, PieChart, ChevronDown,
  Instagram, Facebook, Twitter, Linkedin, Send, Eye, ThumbsUp
} from 'lucide-react';
import CampaignLeads from '../components/CampaignLeads';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const CampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchCampaign();
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchCampaign, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id, autoRefresh]);

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
      await axios.post(`${API_URL}/scraper/analyze/${id}`);
      await fetchCampaign();
    } catch (error) {
      console.error('Analysis failed');
    }
    setActionLoading(false);
  };

  const handleSendEmails = async () => {
    const emailLeads = leads.filter(l => l.isQualified && !l.outreach?.email?.sent && l.email);
    if (emailLeads.length === 0) {
      alert('No qualified leads with email addresses found!');
      return;
    }
    if (!window.confirm(`Send emails to ${emailLeads.length} qualified leads?`)) return;
    
    setActionLoading(true);
    try {
      await axios.post(`${API_URL}/campaigns/${id}/send`);
      await fetchCampaign();
    } catch (error) {
      console.error('Email send failed');
    }
    setActionLoading(false);
  };

  const handleBulkAction = async (action) => {
    const leadsToAction = Array.from(selectedLeads);
    if (leadsToAction.length === 0) return;
    
    if (!window.confirm(`Perform "${action}" on ${leadsToAction.length} selected leads?`)) return;
    
    setActionLoading(true);
    try {
      await axios.post(`${API_URL}/campaigns/${id}/bulk-action`, {
        action,
        leadIds: leadsToAction
      });
      await fetchCampaign();
      setSelectedLeads(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
    setActionLoading(false);
  };

  const exportLeads = () => {
    const exportData = leads.map(lead => ({
      businessName: lead.businessName,
      email: lead.email,
      phone: lead.phone,
      website: lead.website,
      rating: lead.rating,
      isQualified: lead.isQualified,
      qualificationReason: lead.qualificationReason,
      websiteScore: lead.websiteScore,
      createdAt: lead.createdAt
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.name}-leads-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const qualified = leads.filter(l => l.isQualified).length;
    const contacted = leads.filter(l => l.outreach?.email?.sent).length;
    const opened = leads.filter(l => l.outreach?.email?.opened).length;
    const replied = leads.filter(l => l.outreach?.email?.replied).length;
    const withWebsite = leads.filter(l => l.website).length;
    const brokenWebsites = leads.filter(l => l.websiteStatus === 'broken').length;
    const avgWebsiteScore = Math.round(leads.reduce((sum, l) => sum + (l.websiteScore || 0), 0) / total) || 0;
    
    return {
      total,
      qualified,
      contacted,
      opened,
      replied,
      withWebsite,
      brokenWebsites,
      avgWebsiteScore,
      qualificationRate: total ? Math.round((qualified / total) * 100) : 0,
      engagementRate: contacted ? Math.round((opened / contacted) * 100) : 0
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let filtered = [...leads];
    
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => {
        if (filterStatus === 'qualified') return lead.isQualified;
        if (filterStatus === 'unqualified') return !lead.isQualified;
        if (filterStatus === 'contacted') return lead.outreach?.email?.sent;
        if (filterStatus === 'replied') return lead.outreach?.email?.replied;
        return true;
      });
    }
    
    return filtered;
  }, [leads, searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
          <p className="mt-4 text-sm font-medium text-slate-600">Loading campaign data...</p>
        </div>
      </div>
    );
  }
  
  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <button
                onClick={() => navigate('/')}
                className="group inline-flex items-center text-slate-400 hover:text-slate-700 transition-colors text-xs font-bold uppercase tracking-wider mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                Back to Dashboard
              </button>
              
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                  {campaign.name}
                </h1>
                <StatusBadge status={campaign.status} />
                {campaign.status === 'analyzing' && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse" />
                    AI Processing
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  {campaign.niche}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  {campaign.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Created {new Date(campaign.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2.5 rounded-xl transition-all ${
                  autoRefresh ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}
                title={autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
              </button>
              
              <button
                onClick={exportLeads}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              
              <button
                onClick={handleAnalyze}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-all disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                Re-Analyze
              </button>
              
              <button
                onClick={handleSendEmails}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Launch Outreach
              </button>
              
              <button
                onClick={deleteCampaign}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Leads" 
              value={stats.total} 
              icon={Users} 
              trend={`+${stats.qualified} qualified`}
              color="from-slate-500 to-slate-600"
              bgColor="bg-slate-50"
            />
            <StatCard 
              title="Qualification Rate" 
              value={`${stats.qualificationRate}%`} 
              icon={Target} 
              trend={`${stats.qualified}/${stats.total}`}
              color="from-emerald-500 to-emerald-600"
              bgColor="bg-emerald-50"
            />
            <StatCard 
              title="Website Health" 
              value={`${stats.avgWebsiteScore}%`} 
              icon={Globe} 
              trend={`${stats.brokenWebsites} broken sites`}
              color="from-blue-500 to-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard 
              title="Engagement" 
              value={`${stats.engagementRate}%`} 
              icon={TrendingUp} 
              trend={`${stats.opened}/${stats.contacted} opened`}
              color="from-violet-500 to-violet-600"
              bgColor="bg-violet-50"
            />
          </div>
        )}

        {/* Advanced Filters & Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by business name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'qualified', 'unqualified', 'contacted', 'replied'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterStatus(filter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                    filterStatus === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {selectedLeads.size > 0 && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
              >
                <CheckCircle className="h-4 w-4" />
                {selectedLeads.size} selected
              </button>
            )}
          </div>
        </div>

        {/* Bulk Actions Panel */}
        {showBulkActions && selectedLeads.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-blue-900">Bulk Actions ({selectedLeads.size} leads)</h3>
              <button onClick={() => setShowBulkActions(false)} className="text-blue-400 hover:text-blue-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleBulkAction('qualify')} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium">
                Mark as Qualified
              </button>
              <button onClick={() => handleBulkAction('send_email')} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium">
                Send Email
              </button>
              <button onClick={() => handleBulkAction('export')} className="px-3 py-1.5 bg-slate-500 text-white rounded-lg text-xs font-medium">
                Export Selected
              </button>
            </div>
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <CampaignLeads 
              leads={filteredLeads} 
              selectedLeads={selectedLeads}
              onSelectLead={(leadId) => {
                const newSelected = new Set(selectedLeads);
                if (newSelected.has(leadId)) {
                  newSelected.delete(leadId);
                } else {
                  newSelected.add(leadId);
                }
                setSelectedLeads(newSelected);
              }}
              onSelectAll={(selectAll) => {
                if (selectAll) {
                  setSelectedLeads(new Set(filteredLeads.map(l => l._id?.$oid || l._id)));
                } else {
                  setSelectedLeads(new Set());
                }
              }}
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>Showing {filteredLeads.length} of {leads.length} leads</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {stats.qualified} qualified
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {stats.contacted} contacted
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {stats.opened} opened
            </span>
          </div>
          <button onClick={() => setShowStats(!showStats)} className="hover:text-slate-600">
            {showStats ? 'Hide' : 'Show'} stats
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, color, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-4 border border-slate-100 hover:shadow-md transition-all group`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {trend && <p className="text-[10px] text-slate-500 mt-1">{trend}</p>}
      </div>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-white shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </div>
  </div>
);

// Enhanced Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    scraping: { label: 'Scraping', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: RefreshCw },
    analyzing: { label: 'Analyzing', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Zap },
    completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
    failed: { label: 'Failed', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertCircle }
  };
  
  const { label, color, icon: Icon } = config[status] || config.scraping;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${color}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
};

export default CampaignPage;