import { Target, Users } from "lucide-react";

const LeadsMaster = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Lead Database</h1>
          <p className="text-slate-500 text-sm font-medium">Centralized repository of all 4,281 leads found across campaigns</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 text-slate-600"><Target className="h-4 w-4" /> Filter by Campaign</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Filters</h4>
             <div className="space-y-3">
                <FilterToggle label="Has Website" count="3,120" />
                <FilterToggle label="No Website" count="1,161" active />
                <FilterToggle label="Valid Email" count="3,900" />
             </div>
          </div>
        </div>
        <div className="md:col-span-3">
           <div className="bg-white border border-slate-200 rounded-4xl p-8 text-center py-24 shadow-sm">
              <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Leads Explorer</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">Use the global search or filters to drill down into specific lead demographics across your account.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const FilterToggle = ({ label, count, active }) => (
  <div className={`flex justify-between items-center px-4 py-2 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>
     <span className="text-xs font-bold">{label}</span>
     <span className="text-[10px] font-black opacity-50">{count}</span>
  </div>
);

export default LeadsMaster;