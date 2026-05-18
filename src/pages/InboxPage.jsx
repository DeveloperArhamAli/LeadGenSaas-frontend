import { ExternalLink } from "lucide-react";

const InboxPage = () => {
  return (
    <div className="h-[calc(100vh-160px)] flex gap-8">
      {/* Thread List */}
      <div className="w-96 bg-white border border-slate-200 rounded-4xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">All Conversations</div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
           <ThreadItem name="Elite Dental" preview="Yes, we are interested in a redesign. What are..." time="2h ago" unread />
           <ThreadItem name="Avenue Clinic" preview="How much does a basic landing page cost?" time="5h ago" />
           <ThreadItem name="Marina Ortho" preview="Please stop emailing us." time="1d ago" />
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-4xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">EC</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Elite Dental Center</h3>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span> High Interest AI Flag</p>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-900"><ExternalLink className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
           <div className="max-w-md bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 border border-slate-100">
              Hi Elite Dental team, I noticed your business doesn't have a modern website...
           </div>
           <div className="max-w-md ml-auto bg-blue-600 p-4 rounded-2xl text-sm text-white shadow-lg shadow-blue-200">
              Yes, we are interested in a redesign. What are your pricing packages?
           </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
           <input placeholder="Type your response or use / to trigger a template..." className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none ring-blue-500 focus:ring-2 transition-all" />
           <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all">Send Reply</button>
        </div>
      </div>
    </div>
  );
};

const ThreadItem = ({ name, preview, time, unread }) => (
  <div className={`p-6 cursor-pointer hover:bg-slate-50 transition-colors ${unread ? 'bg-blue-50/20' : ''}`}>
    <div className="flex justify-between items-start mb-1">
      <span className="text-sm font-bold text-slate-900">{name}</span>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
    </div>
    <p className={`text-xs truncate ${unread ? 'font-bold text-slate-600' : 'text-slate-400'}`}>{preview}</p>
  </div>
);

export default InboxPage;