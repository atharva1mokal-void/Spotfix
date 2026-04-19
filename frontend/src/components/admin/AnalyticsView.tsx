import React from 'react';
import { departmentStats, categoryDistribution } from '../../lib/constants';
import { GlowingLineChart, NeonDonutChart } from '../ui/HybridCharts';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export function AnalyticsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Core Analytics</h2>
        <div className="flex gap-2">
          <button className="bg-white px-4 py-2 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest hover:border-saffron hover:text-saffron transition-all shadow-sm">Export Report</button>
          <button className="bg-saffron text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-saffron/90 hover:scale-105 transition-all">Live Stream</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Departmental Efficiency */}
        <div className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm flex flex-col h-[480px]">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-navy mb-8">Departmental Resolution Efficiency</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.4)" fontSize={10} tick={{ fontWeight: 600 }} />
                <YAxis stroke="rgba(0,0,0,0.4)" fontSize={10} tick={{ fontWeight: 600 }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '12px' }}
                />
                <Bar dataKey="resolved" fill="var(--green)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="var(--saffron)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm flex flex-col h-[480px]">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8">Incident Classification Volume</h3>
          <div className="flex-1">
            <NeonDonutChart data={categoryDistribution} />
          </div>
        </div>
      </div>

      {/* Leadership Table */}
      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-navy">Performance Leaderboard (Authority Nodes)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Department Name</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Total Requests</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Resolved</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Pending</th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Avg. Turnaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {departmentStats.map((dept, i) => (
                <tr key={i} className="hover:bg-navy/[0.03] transition-all border-l-4 border-l-transparent hover:border-l-green-600">
                  <td className="px-8 py-5 text-sm font-bold text-navy">{dept.name}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-600">{dept.total}</td>
                  <td className="px-8 py-5 text-sm font-black text-green-600">{dept.resolved}</td>
                  <td className="px-8 py-5 text-sm font-bold text-saffron">{dept.pending}</td>
                  <td className="px-8 py-5">
                    <span className="bg-navy/5 px-3 py-1 rounded-full text-[10px] font-black text-navy uppercase">{dept.avgTime}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
