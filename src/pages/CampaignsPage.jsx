import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, Search, MoreVertical, Target, ArrowUpRight, Calendar,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const CampaignsList = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns`);
      setCampaigns(response.data.campaigns);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-blue-600 font-bold animate-pulse tracking-widest uppercase text-xs">Loading Campaigns...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campaigns</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and monitor your AI outreach sequences</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => navigate('/campaigns/new')}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:'grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} onClick={() => navigate(`/campaigns/${campaign._id}`)} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-4xl py-20 text-center">
          <div className="bg-slate-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Target className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No campaigns found</h3>
          <p className="text-slate-500 text-sm mb-6">Start by creating your first automated outreach sequence.</p>
          <button 
            onClick={() => navigate('/campaigns/new')}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
          >
            Create First Campaign
          </button>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const CampaignCard = ({ campaign, onClick }) => {
  const statusColors = {
    scraping: "bg-blue-50 text-blue-600 border-blue-100",
    analyzing: "bg-amber-50 text-amber-600 border-amber-100",
    sending: "bg-emerald-50 text-emerald-600 border-emerald-100",
    completed: "bg-slate-100 text-slate-600 border-slate-200",
    paused: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-slate-200 rounded-4xl p-6 hover:shadow-xl hover:shadow-slate-100 hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-6">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[campaign.status] || statusColors.completed}`}>
          <span className="flex items-center gap-1.5">
            {(campaign.status === 'scraping' || campaign.status === 'sending') && (
              <span className="h-1.5 w-1.5 bg-current rounded-full animate-ping" />
            )}
            {campaign.status}
          </span>
        </span>
        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Campaign Info */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{campaign.name}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1">{campaign.niche} • {campaign.location}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-50">
        <div className="text-center">
          <div className="text-sm font-black text-slate-900">{campaign.stats?.totalLeads || 0}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Leads</div>
        </div>
        <div className="text-center border-x border-slate-50">
          <div className="text-sm font-black text-emerald-600">{campaign.stats?.qualifiedLeads || 0}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Qualified</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-black text-blue-600">{campaign.stats?.emailsSent || 0}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sent</div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="h-3 w-3" />
          <span className="text-[10px] font-bold">Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default CampaignsList;