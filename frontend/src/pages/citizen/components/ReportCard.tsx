import { MapPin, Trash2, ChevronRight, Timer } from 'lucide-react';
import { Issue } from '../../../types';
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { api } from "../../../services/api";
import { toast } from "sonner";
import { useState } from 'react';
import { getDeadlineInfo, DEADLINE_DAYS } from '../../../lib/deadlines';
import { ReportDetailModal } from './ReportDetailModal';
import { MoreVertical } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ReportCardProps {
  issue: Issue;
  onDelete?: (id: string) => void;
}

export function ReportCard({ issue: issueProp, onDelete }: ReportCardProps) {
  const [issue, setIssue] = useState<Issue>(issueProp);
  const [showModal, setShowModal] = useState(false);

  const severityColors = {
    high: 'bg-[#DC143C]',
    medium: 'bg-[#FFCC00]',
    low: 'bg-[#22C55E]',
  };

  const severityLabels = {
    high: 'Severe',
    medium: 'Moderate',
    low: 'Low',
  };

  const statusColors: Record<string, string> = {
    submitted: 'bg-accent/10 text-accent',
    in_progress: 'bg-accent/10 text-accent',
    info_requested: 'bg-yellow-500/10 text-yellow-600',
    pending_verification: 'bg-blue-500/10 text-blue-600',
    resolved: 'bg-accent-secondary/10 text-accent-secondary',
    rejected: 'bg-red-500/10 text-red-600',
  };

  const statusDisplay: Record<string, string> = {
    submitted: 'Reported',
    in_progress: 'In Progress',
    info_requested: 'Info Requested',
    pending_verification: 'Verifying',
    resolved: 'Resolved',
    rejected: 'Rejected',
  };

  const dateStr = issue.reportedAt ? new Date(issue.reportedAt) : new Date();
  const deadline = getDeadlineInfo(issue.reportedAt, issue.priority || 'medium', issue.status);
  const totalDays = DEADLINE_DAYS[issue.priority || 'medium'];

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className={`bg-white/80 backdrop-blur-2xl rounded-[24px] p-0 border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group cursor-pointer ${
          issue.status === 'info_requested'
            ? 'border-yellow-400 hover:border-yellow-500 shadow-yellow-500/10'
            : 'border-card-border/60 hover:border-accent/40 shadow-black/5'
        }`}
      >
        {/* Report frequency badge */}
        {issue.reportCount && issue.reportCount > 1 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-[20px] z-20 shadow-md tracking-widest">
             {issue.reportCount}×
          </div>
        )}
        
        {/* Main Content */}
        <div className="p-6 pb-4">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-5 relative z-10">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`w-12 h-12 ${severityColors[issue.priority || 'medium']} rounded-[16px] flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-text-primary font-black text-[15px] uppercase tracking-tight line-clamp-1 mb-1.5">{issue.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-text-secondary/50 font-mono tracking-widest bg-black/5 px-2 py-0.5 rounded-md">
                    #{issue.id?.slice(-6).toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${statusColors[issue.status] || statusColors.submitted}`}>
                    {statusDisplay[issue.status] || 'Reported'}
                  </span>
                  {issue.status === 'info_requested' && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-yellow-500 text-white animate-pulse shadow-sm shadow-yellow-500/20">
                      ⚠ Action Needed
                    </span>
                  )}
                  {(() => {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    const userId = user.id || user._id;
                    const isReporter = typeof issue.reportedBy === 'string' 
                      ? issue.reportedBy === userId 
                      : (issue.reportedBy as any)?._id === userId || (issue.reportedBy as any)?.id === userId;
                    const hasUpvoted = issue.upvotedBy?.includes(userId as any);
                    
                    if (!isReporter && hasUpvoted) {
                      return (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                          ♥ Supported
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="text-text-secondary hover:text-text-primary transition-colors bg-bg-primary/50 p-2 rounded-xl hover:bg-black/5 focus:outline-none shrink-0 ml-2"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-card-border/50 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-2 min-w-[160px]">
                <DropdownMenuItem 
                  className="flex items-center gap-3 text-red-500 focus:bg-red-50 focus:text-red-600 rounded-xl px-3 py-2.5 cursor-pointer transition-all"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
                      try {
                        await api.deleteIssue(issue.id);
                        toast.success("Report Deleted", { description: "The report has been removed." });
                        if (onDelete) onDelete(issue.id);
                      } catch (err: any) {
                        toast.error("Deletion Failed", { description: err.message });
                      }
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-black text-[11px] uppercase tracking-widest">Delete Report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Info Row */}
          <div className="flex items-center gap-4 mb-5 relative z-10 flex-wrap">
            <div className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-xl border border-black/5">
              <div className={`w-2 h-2 ${severityColors[issue.priority || 'medium']} rounded-full shadow-sm`}></div>
              <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">
                {severityLabels[issue.priority || 'medium']} Priority
              </span>
            </div>

            <div className="flex items-center gap-2 text-text-secondary flex-1 min-w-0 bg-white/50 px-3 py-1.5 rounded-xl border border-card-border/50">
              <MapPin className="w-3.5 h-3.5 text-text-secondary/60 flex-shrink-0" />
              <span className="text-[11px] text-text-secondary font-bold line-clamp-1 truncate">{issue.location?.address || 'Unknown Location'}</span>
            </div>
          </div>

          {/* DEADLINE SECTION */}
          <div 
            className="relative z-10 rounded-xl border overflow-hidden"
            style={{ borderColor: `${deadline.color}20`, backgroundColor: deadline.bgColor }}
          >
            <div className="h-1 w-full bg-black/5 relative">
              <div 
                className="h-full rounded-full transition-all"
                style={{ width: `${deadline.percentage}%`, backgroundColor: deadline.color }}
              />
            </div>

            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <Timer className="w-3.5 h-3.5" style={{ color: deadline.color }} />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-text-secondary/60">
                    Deadline ({totalDays} Days)
                  </p>
                  <p className="text-xs font-black uppercase tracking-tight" style={{ color: deadline.color }}>
                    {deadline.label}
                  </p>
                </div>
              </div>
              <div 
                className="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest"
                style={{ backgroundColor: `${deadline.color}15`, color: deadline.color }}
              >
                {deadline.urgency === 'overdue' ? '⚠ OVERDUE' : 
                 deadline.urgency === 'critical' ? '🔴 CRITICAL' : 
                 deadline.urgency === 'warning' ? '🟡 URGENT' :
                 deadline.urgency === 'resolved' ? '✅ DONE' : '🟢 ON TRACK'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex items-center justify-between relative z-10 bg-bg-primary/50 px-5 py-2.5 border-t border-card-border group-hover:bg-accent/5 transition-colors">
          <span className="text-[10px] text-text-secondary/60 font-medium">{formatDistanceToNow(dateStr, { addSuffix: true })}</span>
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">
            {issue.status === 'info_requested' ? 'View Details & Respond' : 'View Details'} 
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {showModal && createPortal(
        <ReportDetailModal 
          issue={issue} 
          onClose={() => setShowModal(false)} 
          onIssueUpdate={(updated) => setIssue(updated)}
        />,
        document.body
      )}
    </>
  );
}
