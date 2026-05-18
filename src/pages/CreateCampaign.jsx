import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Rocket, Search, Mail, Sparkles, 
  Loader2, CheckCircle2, Timer, AlertCircle,
  Globe, Layout, Target, Settings2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('idle'); // idle, creating, scraping, success, error
  
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    location: 'Kuwait',
    keywords: '',
    maxResults: 50,
    emailSubject: 'Question regarding {{business_name}}',
    emailTemplate: `Hi,\n\nI noticed your business, {{business_name}}, doesn't have a modern website. As a MERN stack developer, I'd love to help you build one.\n\nBest regards,`,
    dailyLimit: 50
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStep('creating');

    try {
      const campaignData = {
        name: formData.name,
        niche: formData.niche,
        location: formData.location,
        scrapingConfig: {
          keywords: formData.keywords.split(',').map(k => k.trim()),
          location: formData.location,
          maxResults: parseInt(formData.maxResults)
        },
        emailConfig: {
          subject: formData.emailSubject,
          template: formData.emailTemplate,
          dailyLimit: parseInt(formData.dailyLimit)
        }
      };

      // 1. Create the Campaign Record
      const response = await axios.post(`${API_URL}/campaigns`, campaignData);
      const campaignId = response.data.campaign._id;
      
      // 2. Trigger the Scraping Engine
      setStep('scraping');
      await axios.post(`${API_URL}/scraper/start`, {
        keyword: formData.keywords.split(',')[0].trim(),
        location: formData.location,
        maxResults: parseInt(formData.maxResults),
        campaignId
      });

      setStep('success');
      setTimeout(() => navigate(`/campaigns/${campaignId}`), 1500);
      
    } catch (error) {
      console.error('Launch Error:', error);
      setStep('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 relative"> 
      
      {loading && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-4xl shadow-2xl max-w-md w-full p-10 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center">
              {step === 'error' ? (
                <div className="p-5 bg-rose-50 rounded-full text-rose-500 animate-bounce">
                  <AlertCircle className="h-12 w-12" />
                </div>
              ) : step === 'success' ? (
                <div className="p-5 bg-emerald-50 rounded-full text-emerald-500 animate-in zoom-in">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
              ) : (
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <Loader2 className="h-20 w-20 text-blue-600 animate-spin absolute" />
                  <Rocket className="h-8 w-8 text-blue-600" />
                </div>
              )}
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">
                {step === 'creating' && "Initiating Engine"}
                {step === 'scraping' && "Extracting Leads"}
                {step === 'success' && "Launch Successful"}
                {step === 'error' && "Launch Failed"}
              </h3>
              <p className="text-slate-500 text-sm font-medium">
                {step === 'creating' && "Finalizing database schemas and hooks..."}
                {step === 'scraping' && "Scanning Google Maps API for new targets..."}
                {step === 'success' && "Redirecting to your new command center..."}
                {step === 'error' && "We hit a snag while communicating with the API."}
              </p>
            </div>

            {/* SKELETON STEPS */}
            <div className="space-y-3">
              <StatusStep label="Database Initialization" status={step === 'creating' ? 'loading' : 'done'} />
              <StatusStep label="Maps API Scraping" status={step === 'scraping' ? 'loading' : step === 'creating' ? 'wait' : 'done'} />
              <StatusStep label="AI Qualification Queue" status={step === 'success' ? 'done' : 'wait'} />
            </div>

            {step === 'scraping' && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <Timer className="h-4 w-4" />
                </div>
                <div>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Est. Completion</div>
                    <div className="text-sm font-bold text-blue-900">~2-4 Minutes</div>
                </div>
              </div>
            )}

            {step === 'error' && (
              <button 
                onClick={() => { setLoading(false); setStep('idle'); }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Return to Editor
              </button>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Sparkles className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Campaign</h1>
                <p className="text-slate-500 text-sm font-medium">Deploy a new AI-powered outreach sequence</p>
            </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: CORE CONFIG */}
        <div className="lg:col-span-2 space-y-8">
          <Section title="Campaign Logistics" icon={Target}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                    label="Campaign Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g., Q1 Web Dev Outreach" 
                    required 
                />
                <FormInput 
                    label="Business Niche" 
                    name="niche" 
                    value={formData.niche} 
                    onChange={handleChange} 
                    placeholder="e.g., Dentist, Florist" 
                    required 
                />
            </div>
          </Section>

          <Section title="Scraping Parameters" icon={Search}>
            <div className="space-y-6">
                <FormInput 
                    label="Keywords (comma separated)" 
                    name="keywords" 
                    value={formData.keywords} 
                    onChange={handleChange} 
                    placeholder="dentist without website, old website dentist" 
                    required 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput 
                        label="Location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                    />
                    <FormInput 
                        label="Max Lead Capacity" 
                        name="maxResults" 
                        type="number"
                        value={formData.maxResults} 
                        onChange={handleChange} 
                    />
                </div>
            </div>
          </Section>

          <Section title="Email Outreach Template" icon={Mail}>
            <div className="space-y-6">
                <FormInput 
                    label="Subject Line" 
                    name="emailSubject" 
                    value={formData.emailSubject} 
                    onChange={handleChange} 
                    required 
                />
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Body</label>
                    <textarea
                        name="emailTemplate"
                        value={formData.emailTemplate}
                        onChange={handleChange}
                        className="w-full h-48 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        required
                    />
                    <p className="text-[10px] text-slate-400 font-medium italic">Available Tags: {"{{business_name}}"}</p>
                </div>
            </div>
          </Section>
        </div>

        {/* RIGHT COLUMN: SIDEBAR SETTINGS */}
        <div className="space-y-8">
            <Section title="Launch Controls" icon={Settings2}>
                <div className="space-y-6">
                    <FormInput 
                        label="Daily Email Limit" 
                        name="dailyLimit" 
                        type="number"
                        value={formData.dailyLimit} 
                        onChange={handleChange} 
                    />
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3"
                        >
                            <Rocket className="h-4 w-4" />
                            Launch Campaign
                        </button>
                        <p className="mt-4 text-[10px] text-slate-400 text-center font-medium leading-relaxed">
                            By launching, you initiate our scrapers to scan Google Maps live. 
                            Estimated data processing: 2-5 minutes.
                        </p>
                    </div>
                </div>
            </Section>

            {/* QUICK PREVIEW CARD */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Layout className="h-32 w-32 rotate-12" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-blue-400">Live Preview</h4>
                <div className="space-y-4 relative z-10">
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Target</div>
                        <div className="text-sm font-bold">{formData.niche || '...'} in {formData.location}</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Subject</div>
                        <div className="text-sm font-medium line-clamp-1">{formData.emailSubject}</div>
                    </div>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm">
    <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
            <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{title}</h3>
    </div>
    {children}
  </div>
);

const FormInput = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
    />
  </div>
);

const StatusStep = ({ label, status }) => {
  const isDone = status === 'done';
  const isLoading = status === 'loading';
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDone ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
      <span className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
        {label}
      </span>
      {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
      {isLoading && <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
      {status === 'wait' && <div className="h-2 w-2 rounded-full bg-slate-200" />}
    </div>
  );
};

export default CreateCampaign;