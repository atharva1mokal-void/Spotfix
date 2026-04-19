import React from 'react';
import { Issue } from '../../types';
import { format } from 'date-fns';
import { statusConfig } from '../../lib/constants';

interface RecentIncidentLogProps {
  issues: Issue[];
}

export function RecentIncidentLog({ issues }: RecentIncidentLogProps) {
  const latestIssues = [...issues].sort((a, b) => 
    new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  ).slice(0, 10);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-card-border bg-card-bg backdrop-blur-3xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border bg-bg-primary/50">
              <th className="px-6 py-5 text-[10px] uppercase font-black text-text-secondary tracking-widest text-center">Log ID</th>
              <th className="px-6 py-5 text-[10px] uppercase font-black text-text-secondary tracking-widest">Incident Details</th>
              <th className="px-6 py-5 text-[10px] uppercase font-black text-text-secondary tracking-widest">District</th>
              <th className="px-6 py-5 text-[10px] uppercase font-black text-text-secondary tracking-widest">Timestamp</th>
              <th className="px-6 py-5 text-[10px] uppercase font-black text-text-secondary tracking-widest">Status</th>
              <th className="px-6 py-5 text-[10px] uppercase font-black text-text-secondary tracking-widest">Priority</th>
              <th className="px-6 py-5 text-[10px] uppercase font-black text-text-secondary tracking-widest text-center">Freq</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {latestIssues.length > 0 ? (
              latestIssues.map((issue) => (
                <tr key={issue.id} className="group hover:bg-accent/5 transition-all cursor-default border-l-4 border-l-transparent hover:border-l-accent">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-xs font-mono font-black text-text-primary">
                      #{issue.id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-text-primary uppercase tracking-tight line-clamp-1">{issue.title}</span>
                      <span className="text-[9px] text-text-secondary font-black uppercase tracking-widest mt-0.5">{issue.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{issue.location.address.split(',')[0]}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">{format(new Date(issue.reportedAt), 'h:mm a')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter"
                      style={{ 
                        backgroundColor: `${statusConfig[issue.status].color}12`,
                        color: statusConfig[issue.status].color,
                        border: `1px solid ${statusConfig[issue.status].color}25`
                      }}
                    >
                      {statusConfig[issue.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      issue.priority === 'high' ? 'text-[#DC143C]' : 
                      issue.priority === 'medium' ? 'text-[#FFCC00]' : 
                      'text-[#22C55E]'
                    }`}>
                      {issue.priority === 'high' ? 'Severe' : issue.priority === 'medium' ? 'Moderate' : 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[10px] font-black border tracking-tighter shadow-sm ${
                      (issue.reportCount || 1) > 5 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      (issue.reportCount || 1) > 2 ? 'bg-accent/10 text-accent border-accent/20' : 
                      'bg-bg-primary text-text-secondary border-card-border'
                    }`}>
                      {issue.reportCount || 1}
                    </div>
                  </td>
                </tr>

              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                  No localized incidents recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
