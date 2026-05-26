import { useState } from 'react';
import { 
  Globe, Mail, Phone, Instagram, CheckCircle, AlertCircle, 
  ChevronDown, ChevronUp, ExternalLink, MapPin, Star, 
  AlertTriangle, Clock, MessageCircle, XCircle, Zap, 
  Facebook, Twitter, Linkedin, Youtube, ThumbsUp, ThumbsDown,
  Wifi, WifiOff, ShieldAlert
} from 'lucide-react';

const LeadCard = ({ lead }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper function to safely access MongoDB nested fields
  const getSafeValue = (obj, path, defaultValue = null) => {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object') {
        if (part === '$oid' && acc.$oid) return acc.$oid;
        if (part === '$date' && acc.$date) return acc.$date;
        return acc[part];
      }
      return defaultValue;
    }, obj) || defaultValue;
  };

  // Safely extract data
  const leadId = getSafeValue(lead, '_id.$oid', lead._id);
  const createdAt = getSafeValue(lead, 'createdAt.$date', lead.createdAt);
  const businessName = lead.businessName || 'Unknown Business';
  const website = lead.website || null;
  const websiteStatus = lead.websiteStatus || 'unknown';
  const websiteScore = lead.websiteScore || 0;
  const websiteIssues = lead.websiteIssues || [];
  const contactScore = lead.contactScore || 0;
  const isQualified = lead.isQualified || false;
  const qualificationReason = lead.qualificationReason || null;
  const disqualificationReason = lead.disqualificationReason || null;
  const rating = lead.rating || null;
  const location = lead.location || null;
  const mapsUrl = lead.mapsUrl || null;
  const tags = lead.tags || [];
  const availableChannels = lead.availableChannels || [];
  const outreach = lead.outreach || {};

  // Contact info
  const email = lead.email || null;
  const phone = lead.phone || null;
  const instagram = lead.instagram || null;
  const facebook = lead.facebook || null;
  const twitter = lead.twitter || null;
  const linkedin = lead.linkedin || null;
  const whatsapp = lead.whatsapp || null;

  const getStatusColor = () => {
    if (isQualified) return 'emerald';
    return 'slate';
  };

  const getWebsiteStatusConfig = () => {
    switch(websiteStatus) {
      case 'broken':
        return { color: 'rose', icon: ShieldAlert, text: 'Broken' };
      case 'active':
        return { color: 'emerald', icon: Wifi, text: 'Active' };
      default:
        return { color: 'amber', icon: WifiOff, text: 'Unknown' };
    }
  };

  const websiteStatusConfig = getWebsiteStatusConfig();
  const StatusIcon = websiteStatusConfig.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
      {/* Main Card Header - Always Visible */}
      <div className="p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Business Avatar */}
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-base font-bold ${
              isQualified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {businessName.charAt(0)}
            </div>
            
            {/* Business Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{businessName}</h3>
                {rating && (
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{rating}</span>
                  </div>
                )}
                {websiteStatus && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-${websiteStatusConfig.color}-50`}>
                    <StatusIcon className={`h-3 w-3 text-${websiteStatusConfig.color}-500`} />
                    <span className={`text-xs font-bold text-${websiteStatusConfig.color}-700 capitalize`}>
                      {websiteStatusConfig.text}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Quick Stats Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                {website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    <span className="font-mono">Website Score: {websiteScore}%</span>
                    <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${websiteScore}%` }} />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-3 w-3" />
                  <span>Contact Score: {contactScore}/10</span>
                </div>
                
                {createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Qualification Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              isQualified ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {isQualified ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {isQualified ? 'Qualified' : 'Rejected'}
            </div>
            
            {/* Expand Button */}
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Expanded Details Section */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6">
          {/* Qualification/Disqualification Reasons */}
          {qualificationReason && (
            <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-emerald-900 mb-1 flex items-center gap-2">
                    Qualification Reason 
                    <span className="text-xs font-normal bg-emerald-200 px-2 py-0.5 rounded-full">AI Decision</span>
                  </h4>
                  <p className="text-sm text-emerald-800">{qualificationReason}</p>
                </div>
              </div>
            </div>
          )}
          
          {disqualificationReason && (
            <div className="bg-rose-50/50 rounded-lg p-4 border border-rose-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-rose-900 mb-1">Disqualification Reason</h4>
                  <p className="text-sm text-rose-800">{disqualificationReason}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Website Details Section - FIXED to show websiteIssues */}
            {website && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Globe className="h-4 w-4" /> Website Analysis
                </h4>
                
                <div className="space-y-3">
                  {/* Website Status Card */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500">Status</span>
                      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-${websiteStatusConfig.color}-50 text-${websiteStatusConfig.color}-700`}>
                        <StatusIcon className="h-3 w-3" />
                        {websiteStatusConfig.text}
                      </div>
                    </div>
                    
                    <a 
                      href={website} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline break-all"
                    >
                      {website} <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                  
                  {/* Website Issues Section - NOW VISIBLE */}
                  {websiteIssues && websiteIssues.length > 0 && (
                    <div className="bg-rose-50 rounded-lg p-3 border border-rose-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                        <h5 className="text-sm font-bold text-rose-900">Issues Detected ({websiteIssues.length})</h5>
                      </div>
                      <div className="space-y-1.5">
                        {websiteIssues.map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-rose-700 bg-white/50 px-2 py-1.5 rounded">
                            <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Website Score Details */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600">Health Score</span>
                      <span className="text-sm font-bold text-slate-900">{websiteScore}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          websiteScore >= 70 ? 'bg-emerald-500' : 
                          websiteScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                        }`} 
                        style={{ width: `${websiteScore}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact Channels Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                <MessageCircle className="h-4 w-4" /> Available Channels
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs p-2 bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-slate-700 truncate flex-1">{email}</span>
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="flex items-center gap-2 text-xs p-2 bg-white rounded-lg border border-slate-200 hover:border-green-200 hover:bg-green-50 transition-colors group">
                    <Phone className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-slate-700">{phone}</span>
                  </a>
                )}
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs p-2 bg-white rounded-lg border border-slate-200 hover:border-green-200 hover:bg-green-50 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-slate-700">WhatsApp</span>
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs p-2 bg-white rounded-lg border border-slate-200 hover:border-pink-200 hover:bg-pink-50 transition-colors">
                    <Instagram className="h-3.5 w-3.5 text-pink-500" />
                    <span className="text-slate-700">Instagram</span>
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs p-2 bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <Facebook className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-slate-700">Facebook</span>
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs p-2 bg-white rounded-lg border border-slate-200 hover:border-sky-200 hover:bg-sky-50 transition-colors">
                    <Twitter className="h-3.5 w-3.5 text-sky-500" />
                    <span className="text-slate-700">Twitter</span>
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs p-2 bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <Linkedin className="h-3.5 w-3.5 text-blue-700" />
                    <span className="text-slate-700">LinkedIn</span>
                  </a>
                )}
              </div>
              
              {availableChannels.length > 0 && (
                <div className="mt-2 p-2 bg-slate-100 rounded-lg">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Detected Channels</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {availableChannels.map((channel, idx) => (
                      <span key={idx} className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Business Details Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                <MapPin className="h-4 w-4" /> Business Information
              </h4>
              
              <div className="space-y-3 bg-white rounded-lg p-3 border border-slate-200">
                {location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                    <span className="text-sm text-slate-700">{location}</span>
                  </div>
                )}
                
                {mapsUrl && (
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    View on Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {tags && tags.length > 0 && (
                  <div className="mt-2">
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Tags</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Lead ID</span>
                    <span className="text-[10px] font-mono text-slate-400">{leadId}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Outreach Status Section */}
            {outreach && Object.keys(outreach).length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <ThumbsUp className="h-4 w-4" /> Outreach Status
                </h4>
                
                <div className="space-y-2 bg-white rounded-lg p-3 border border-slate-200">
                  {Object.entries(outreach).map(([channel, status]) => {
                    const hasActivity = Object.values(status).some(v => v === true);
                    if (!hasActivity) return null;
                    return (
                      <div key={channel} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600 capitalize">{channel}:</span>
                        <div className="flex gap-2">
                          {Object.entries(status).map(([action, performed]) => (
                            performed && (
                              <span key={action} className="text-emerald-600 capitalize">
                                {action}
                              </span>
                            )
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
              View Full Details
            </button>
            <button className="px-4 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-blue-600 transition-all shadow-sm">
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const CampaignLeads = ({ leads = [] }) => {
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredLeads = () => {
    let result = leads;
    
    // Apply qualification filter
    if (filter === 'qualified') result = result.filter(l => l.isQualified);
    if (filter === 'unqualified') result = result.filter(l => !l.isQualified);
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(l => 
        l.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  };

  const filtered = getFilteredLeads();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Campaign Leads</h2>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} of {leads.length} leads displayed
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <Globe className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {['all', 'qualified', 'unqualified'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                  filter === f 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Leads Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No leads found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => (
            <LeadCard key={lead._id?.$oid || lead._id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignLeads;