import React, { useState } from 'react';
import { User, Mail, Shield, Bell, Moon, Globe, Check, Camera, LogOut, Activity } from 'lucide-react';

export function SettingsView() {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-navy uppercase tracking-tight">System Settings</h2>
        <button 
          onClick={handleSave}
          className="bg-navy text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-navy/90 transition-all"
        >
          {saveSuccess ? <Check size={16} /> : null}
          {saveSuccess ? 'Changes Applied' : 'Synchronize Config'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-6">
              <div className="w-24 h-24 rounded-[32px] bg-saffron/10 flex items-center justify-center border-2 border-dashed border-saffron/30 group-hover:border-saffron transition-all overflow-hidden">
                <User size={40} className="text-saffron" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-navy text-white p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Camera size={14} />
              </div>
            </div>
            <h4 className="text-xl font-black text-navy uppercase tracking-tighter">Root Administrator</h4>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Strategic Control Level 5</p>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-8 border-t border-gray-50">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Session</p>
                <p className="text-sm font-bold text-navy">4h 12m</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Latency</p>
                <p className="text-sm font-bold text-green-600">Stable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Configuration */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-8">Node Parameters</h3>
            
            <div className="space-y-6">
              <SettingInput label="Display Alias" value="Root_Admin_01" icon={User} />
              <SettingInput label="Communication Channel" value="admin@spotfix.gov.in" icon={Mail} />
              
              <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                <SettingToggle label="Real-time Synchronization" description="Automatic data propagation across all authority nodes." icon={Activity} active />
                <SettingToggle label="Critical Alert Proxy" description="Direct emergency signaling for High Priority reports." icon={Bell} active />
                <SettingToggle label="Strategic Dark Mode" description="Optimized UI rendering for low-light command centers." icon={Moon} />
                <SettingToggle label="Public Data Transparency" description="Make non-sensitive metadata available via public API." icon={Globe} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingInput({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Icon size={12} /> {label}
      </label>
      <input 
        type="text" 
        defaultValue={value}
        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-navy outline-none focus:border-saffron/40 transition-all"
      />
    </div>
  );
}

function SettingToggle({ label, description, icon: Icon, active = false }: { label: string, description: string, icon: any, active?: boolean }) {
  const [enabled, setEnabled] = useState(active);
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
      <div className={`p-2.5 rounded-xl transition-all ${enabled ? 'bg-saffron/10 text-saffron' : 'bg-gray-100 text-gray-400'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-navy">{label}</span>
          <button 
            onClick={() => setEnabled(!enabled)}
            className={`w-10 h-5 rounded-full transition-all relative ${enabled ? 'bg-saffron shadow-[0_0_10px_rgba(255,153,51,0.4)]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        <p className="text-[10px] font-bold text-gray-400 leading-tight">{description}</p>
      </div>
    </div>
  );
}
