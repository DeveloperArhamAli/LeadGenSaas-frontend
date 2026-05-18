import React from 'react';
import { 
  ExternalLink, Globe, MapPin, Star, Mail, 
  CheckCircle, XCircle, Clock, MoreHorizontal
} from 'lucide-react';

const CampaignDetails = () => {
  const stats = [
    { label: 'Scanned', value: '428', color: 'blue' },
    { label: 'Qualified', value: '89', color: 'emerald' },
    { label: 'Emails Sent', value: '42', color: 'violet' },
    { label: 'Replied', value: '12', color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Campaign Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Q1 Dentist Outreach</h1>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Running
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Targeting Dentists in Kuwait City • Using "Modern Web" Template</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Pause Campaign</button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200">Export Leads</button>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 p-6 rounded-4xl shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Leads Table Section */}
      <div className="bg-white border border-slate-200 rounded-4xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Lead Feed</h3>
          <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 font-bold italic">Auto-refreshing in 12s...</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Business Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Contact Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">AI Qualification</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Sentiment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <LeadRow name="Sparkle Dental" website="sparkle.kw" status="Email Sent" qualification="High (No Mobile Site)" sentiment="Neutral" />
              <LeadRow name="City Dental Center" website="None Found" status="Scraped" qualification="Critical (No Web Presence)" sentiment="N/A" isNew />
              <LeadRow name="Elite Orthodontics" website="elite-kw.com" status="Paused" qualification="Low (Modern Site)" sentiment="N/A" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LeadRow = ({ name, website, status, qualification, sentiment, isNew }) => (
  <tr className={`group hover:bg-slate-50 transition-colors ${isNew ? 'bg-blue-50/30' : ''}`}>
    <td className="px-6 py-5">
      <div className="font-bold text-slate-900 flex items-center gap-2">
        {name} {isNew && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md uppercase tracking-tighter">New</span>}
      </div>
      <div className="text-xs text-slate-400 flex items-center gap-1"><Globe className="h-3 w-3" /> {website}</div>
    </td>
    <td className="px-6 py-5">
      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-widest">{status}</span>
    </td>
    <td className="px-6 py-5">
      <div className="text-xs font-bold text-slate-700">{qualification}</div>
    </td>
    <td className="px-6 py-5 italic text-slate-400 text-xs">{sentiment}</td>
    <td className="px-6 py-5 text-right">
      <button className="p-2 text-slate-400 hover:text-slate-900"><MoreHorizontal className="h-4 w-4" /></button>
    </td>
  </tr>
);

export default CampaignDetails;