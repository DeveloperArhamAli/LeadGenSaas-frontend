import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, Download, Filter, ChevronDown, Mail, Phone, Globe, 
  MapPin, Building, CheckCircle, AlertCircle, Star, ExternalLink, 
  MoreVertical, RefreshCw, Users, Target, BarChart3, X, Plus
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const Leads = () => {
  // --- State ---
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', source: 'all' });
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Overlay State
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  // --- Data Fetching ---
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/leads`);
      const enhancedData = response.data.map(lead => ({
        ...lead,
        leadScore: lead.leadScore || Math.floor(Math.random() * 100) + 1,
        source: lead.source || 'Website',
        notes: lead.notes || [] 
      }));
      setLeads(enhancedData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  // --- Logic ---
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        const matchesSearch = !search || [lead.businessName, lead.email].some(f => f?.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = filters.status === 'all' || (filters.status === 'qualified' ? lead.isQualified : lead.emailSent);
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => sortBy === 'score' ? b.leadScore - a.leadScore : new Date(b.lastContacted) - new Date(a.lastContacted));
  }, [leads, search, filters, sortBy]);

  const openLead = (lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  if (loading) return <div className="flex h-96 items-center justify-center animate-pulse text-blue-600 font-medium">Loading Leads...</div>;

  return (
    <div className="max-w-(--突破-7xl) mx-auto p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads Management</h1>
          <p className="text-slate-500 text-sm">Review, qualify, and contact your generated prospects.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchLeads} className="p-2.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-xl transition-all">
            <RefreshCw className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats Grid - Matching Dashboard Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Prospects" value={leads.length} icon={Users} trend="+12% vs last month" />
        <StatCard title="Qualified" value={leads.filter(l => l.isQualified).length} icon={Target} color="text-emerald-600" />
        <StatCard title="Contacted" value={leads.filter(l => l.emailSent).length} icon={Mail} color="text-blue-600" />
        <StatCard title="Conversion" value="24%" icon={BarChart3} color="text-violet-600" />
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <select className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl outline-none" onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Sort: Newest</option>
              <option value="score">Sort: Score</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Business</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Quality</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead._id} 
                  onClick={() => openLead(lead)}
                  className="group hover:bg-blue-50/30 cursor-pointer transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {lead.businessName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{lead.businessName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {lead.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-slate-300" /> {lead.email}</span>
                      {lead.phone && <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-300" /> {lead.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreStyle(lead.leadScore)}`}>
                      <Star className="h-3 w-3 fill-current" /> {lead.leadScore}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill lead={lead} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-md transition-all">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Overlay Drawer --- */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-visibility ${isDrawerOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsDrawerOpen(false)} />
        
        <div className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedLead && (
            <>
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                    {selectedLead.businessName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedLead.businessName}</h2>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 uppercase tracking-widest">{selectedLead.source}</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X className="h-5 w-5" /></button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                    <Mail className="h-4 w-4" /> Send Email
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                    <Target className="h-4 w-4 text-emerald-500" /> Qualify Lead
                  </button>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem icon={Mail} label="Email Address" value={selectedLead.email} />
                    <DetailItem icon={Phone} label="Phone Number" value={selectedLead.phone || 'Not provided'} />
                    <DetailItem icon={MapPin} label="Location" value={selectedLead.location} />
                    <DetailItem icon={Globe} label="Website" value={selectedLead.website} isLink />
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lead Notes</h3>
                  <div className="relative">
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-all"
                      placeholder="Type a note about this lead..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    ></textarea>
                    <button className="absolute bottom-3 right-3 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, icon: Icon, color = "text-slate-600", trend }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-slate-50 rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
      {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{trend}</span>}
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</p>
  </div>
);

const DetailItem = ({ icon: Icon, label, value, isLink }) => (
  <div className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
    <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-100"><Icon className="h-4 w-4" /></div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{label}</p>
      {isLink ? <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">{value}</a> : <p className="text-sm font-semibold text-slate-700">{value}</p>}
    </div>
  </div>
);

const StatusPill = ({ lead }) => {
  if (lead.replied) return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[11px] font-bold">Replied</span>;
  if (lead.emailSent) return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[11px] font-bold">Contacted</span>;
  return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[11px] font-bold">New Lead</span>;
};

const getScoreStyle = (score) => {
  if (score >= 80) return "bg-emerald-50 text-emerald-600 border-emerald-100";
  if (score >= 50) return "bg-blue-50 text-blue-600 border-blue-100";
  return "bg-slate-50 text-slate-500 border-slate-200";
};

export default Leads;