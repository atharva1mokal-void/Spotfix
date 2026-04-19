import React, { useState, useEffect } from 'react';
import { Shield, Activity, Cpu, Server, Database, Globe, Lock, Terminal as TerminalIcon } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function SystemView() {
  const [latencyData, setLatencyData] = useState<{time: string, ms: number}[]>([]);

  useEffect(() => {
    // Generate some simulated latency data
    const data = Array.from({ length: 20 }).map((_, i) => ({
      time: `${i}:00`,
      ms: Math.floor(Math.random() * 40) + 10
    }));
    setLatencyData(data);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-navy uppercase tracking-tight">System Infrastructure</h2>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-sm font-black text-green-600 uppercase tracking-widest">Core Engine: Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard icon={Cpu} label="CPU Load" value="28%" color="var(--saffron)" />
        <StatusCard icon={Server} label="Memory Usage" value="4.2 GB" color="var(--navy)" />
        <StatusCard icon={Database} label="DB Conn" value="Active" color="var(--green)" />
        <StatusCard icon={Globe} label="API Latency" value="24ms" color="var(--turmeric)" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Latency Map */}
        <div className="xl:col-span-8 bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-8">API Performance Metrics (ms)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <defs>
                  <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--saffron)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--saffron)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(0,0,0,0.3)" fontSize={10} hide />
                <YAxis stroke="rgba(0,0,0,0.3)" fontSize={10} />
                <Tooltip />
                <Area type="monotone" dataKey="ms" stroke="var(--saffron)" fillOpacity={1} fill="url(#colorMs)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="xl:col-span-4 bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col h-[400px]">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
            <TerminalIcon size={14} /> Local Audit Ledger
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pr-2">
            <LogEntry time="19:24" icon={Lock} label="Security" content="Admin Session Authenticated" color="green" />
            <LogEntry time="18:12" icon={Activity} label="System" content="Database Migration Complete" color="navy" />
            <LogEntry time="17:45" icon={Shield} label="Auth" content="Authority Node 'CIDCO' Registered" color="saffron" />
            <LogEntry time="16:30" icon={Activity} label="System" content="Daily Asset Re-indexing Started" color="turmeric" />
            <LogEntry time="15:10" icon={Lock} label="Access" content="Global API Key Rotated" color="green" />
            <LogEntry time="14:05" icon={Activity} label="System" content="Cold Storage Archival Logic Triggered" color="navy" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="bg-white p-6 border border-gray-100 rounded-[24px] shadow-sm flex items-center justify-between group hover:border-saffron hover:shadow-xl hover:-translate-y-1 transition-all cursor-default">
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-navy transition-colors">{label}</p>
        <p className="text-3xl font-black text-navy">{value}</p>
      </div>
      <div className="p-4 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-saffron group-hover:text-white transition-all shadow-inner">
        <Icon size={24} />
      </div>
    </div>
  );
}

function LogEntry({ time, label, content, color, icon: Icon }: { time: string, label: string, content: string, color: string, icon: any }) {
  const colorMap: any = { saffron: 'text-saffron bg-saffron/10', green: 'text-green-600 bg-green-50', navy: 'text-navy bg-navy/10', turmeric: 'text-turmeric bg-turmeric/10' };
  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-navy/[0.03] transition-all group border-l-2 border-l-transparent hover:border-l-saffron cursor-default">
      <span className="text-xs font-mono text-gray-400 mt-1">{time}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className={`p-1.5 rounded-lg ${colorMap[color]} group-hover:scale-110 transition-transform`}>
            <Icon size={12} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-navy transition-colors">{label}</span>
        </div>
        <p className="text-sm font-bold text-gray-700 leading-tight">{content}</p>
      </div>
    </div>
  );
}
