import { motion, AnimatePresence } from "motion/react";
import {
  X, MapPin, Clock, CheckCircle2, AlertCircle, MessageSquare,
  Upload, Loader2, Send, ShieldCheck, Image as ImageIcon, FileText,
  Calendar, Tag, Building2, Flag, User, Heart
} from "lucide-react";
import { Issue } from "../../../types";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { api } from "../../../services/api";
import { toast } from "sonner";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

interface ReportDetailModalProps {
  issue: Issue;
  onClose: () => void;
  onIssueUpdate: (updated: Issue) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  submitted:            { label: "Submitted",            color: "text-orange-600",  bg: "bg-orange-500/10" },
  in_progress:          { label: "In Progress",          color: "text-blue-600",    bg: "bg-blue-500/10" },
  info_requested:       { label: "Info Requested",       color: "text-yellow-700",  bg: "bg-yellow-500/20" },
  pending_verification: { label: "Verifying",            color: "text-purple-600",  bg: "bg-purple-500/10" },
  resolved:             { label: "Resolved",             color: "text-green-700",   bg: "bg-green-500/10" },
  rejected:             { label: "Rejected",             color: "text-red-600",     bg: "bg-red-500/10" },
};

const steps = [
  { id: "submitted",            label: "Report Submitted",          desc: "Logged and waiting for review." },
  { id: "in_progress",          label: "Work In Progress",          desc: "Field team is actively working." },
  { id: "info_requested",       label: "Information Needed",        desc: "Authority needs additional details." },
  { id: "pending_verification", label: "Awaiting Verification",     desc: "Admin is reviewing resolution proof." },
  { id: "resolved",             label: "Successfully Resolved",     desc: "Issue has been fixed and closed." },
];

const statusOrder = ["submitted", "in_progress", "pending_verification", "resolved"];

function StatusTimeline({ issue }: { issue: Issue }) {
  const currentIdx = statusOrder.indexOf(issue.status);
  return (
    <div className="space-y-4">
      {steps
        .filter(s => {
          if (s.id === "submitted" || s.id === "resolved") return true;
          if (s.id === issue.status) return true;
          if (s.id === "info_requested" && (issue as any).infoRequestMessage) return true;
          if (s.id === "pending_verification" && (issue.status === "pending_verification" || issue.status === "resolved")) return true;
          if (s.id === "in_progress" && currentIdx >= statusOrder.indexOf("in_progress")) return true;
          return false;
        })
        .map((step) => {
          const isActive = issue.status === step.id;
          const isDone =
            step.id === "submitted" ||
            (step.id === "in_progress" && ["pending_verification", "resolved"].includes(issue.status)) ||
            (step.id === "pending_verification" && issue.status === "resolved") ||
            issue.status === "resolved";
          const isInfoStep = step.id === "info_requested";

          return (
            <div key={step.id} className={`flex gap-4 items-start ${!isActive && !isDone && !isInfoStep ? "opacity-40" : ""}`}>
              <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  isDone ? "bg-green-500 text-white shadow-md shadow-green-500/20" :
                  isActive ? "bg-accent text-white shadow-md shadow-accent/20" :
                  isInfoStep && (issue as any).infoRequestMessage ? "bg-yellow-500 text-white shadow-md shadow-yellow-500/20" :
                  "bg-card-border text-text-secondary/50"
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> :
                   isActive ? <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} /> :
                   <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pb-4 border-b border-card-border/30 last:border-0 last:pb-0">
                <p className={`text-sm font-black uppercase tracking-wide ${isActive ? "text-text-primary" : isDone ? "text-green-700" : "text-text-secondary"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-text-secondary mt-1">{step.desc}</p>
                
                {isInfoStep && (issue as any).infoRequestMessage && (
                  <div className="mt-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-1">Authority Message</p>
                    <p className="text-sm text-yellow-900 leading-relaxed">{(issue as any).infoRequestMessage}</p>
                  </div>
                )}
                {isInfoStep && (issue as any).infoProvidedMessage && (
                  <div className="mt-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-1">Your Response</p>
                    <p className="text-sm text-green-900 leading-relaxed">{(issue as any).infoProvidedMessage}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export function ReportDetailModal({ issue, onClose, onIssueUpdate }: ReportDetailModalProps) {
  const [showProvideInfo, setShowProvideInfo] = useState(false);
  const [infoText, setInfoText] = useState("");
  const [infoImage, setInfoImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sc = statusConfig[issue.status] || statusConfig.submitted;
  const isInfoRequested = issue.status === "info_requested";
  const hasResponded = !!(issue as any).infoProvidedMessage;

  const handleProvideInfo = async () => {
    if (!infoText.trim()) { toast.error("Please enter a message."); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("status", "in_progress");
      formData.append("infoProvidedMessage", infoText);
      if (infoImage) formData.append("updateImage", infoImage);
      const updated = await api.updateIssue(issue.id, formData);
      toast.success("Information submitted! The authority will review it.");
      setShowProvideInfo(false);
      setInfoText("");
      setInfoImage(null);
      onIssueUpdate(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const [upvoting, setUpvoting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const hasUpvoted = issue.upvotedBy?.includes(user.id || user._id);

  const handleUpvote = async () => {
    if (upvoting) return;
    setUpvoting(true);
    try {
      const updated = await api.upvoteIssue(issue.id);
      onIssueUpdate(updated);
      toast.success(hasUpvoted ? "Support removed" : "Issue supported!", { 
        description: hasUpvoted ? "You are no longer supporting this issue." : "Authorities have been notified of community interest." 
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpvoting(false);
    }
  };

  const mainImageSrc = issue.imageUrl ? `${API_BASE}${issue.imageUrl}` : null;
  const afterImageSrc = (issue as any).afterImageUrl ? `${API_BASE}${(issue as any).afterImageUrl}` : null;
  const infoImageSrc = (issue as any).infoImageUrl ? `${API_BASE}${(issue as any).infoImageUrl}` : null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          key="modal"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full max-w-2xl bg-card-bg backdrop-blur-2xl rounded-[32px] border border-card-border shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
          style={{ maxHeight: "calc(100vh - 40px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-card-border/50 bg-black/5 flex-shrink-0 z-10">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5 font-mono">
                Report #{issue.id?.slice(-8).toUpperCase()}
              </p>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black text-text-primary capitalize tracking-tight truncate leading-tight">
                  {issue.title}
                </h2>
                <span 
                  className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                  style={{ backgroundColor: `${sc.color}15`, color: sc.color, borderColor: `${sc.color}30` }}
                >
                  {sc.label}
                </span>
                <button
                  onClick={handleUpvote}
                  disabled={upvoting}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    hasUpvoted 
                      ? "bg-red-500 text-white border-red-500 shadow-sm" 
                      : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                  } border`}
                >
                  {upvoting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Heart className={`w-3 h-3 ${hasUpvoted ? "fill-current" : ""}`} />}
                  {issue.upvotedBy?.length || 0} Support{issue.upvotedBy?.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 transition-colors text-text-secondary hover:text-text-primary flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

            {/* Hero Image */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-card-border/50 bg-black/5 relative flex items-center justify-center">
              {mainImageSrc ? (
                <>
                  <img
                    src={mainImageSrc}
                    alt={issue.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">Reported Photo</span>
                  </div>
                </>
              ) : (
                <div className="text-6xl opacity-50 flex items-center justify-center w-full h-full text-text-secondary">
                  No Image Available
                </div>
              )}
            </div>

            {/* Metadata Grid (Icon Lockups) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 border border-card-border/50">
                <Tag className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Category</h4>
                  <p className="text-sm font-semibold text-text-primary capitalize">{issue.category?.replace("_", " ")}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 border border-card-border/50">
                <Flag className={`w-5 h-5 mt-0.5 ${
                  issue.priority === "high" ? "text-red-500" : issue.priority === "medium" ? "text-orange-500" : "text-green-500"
                }`} />
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Priority</h4>
                  <p className={`text-sm font-semibold capitalize ${
                    issue.priority === "high" ? "text-red-600" : issue.priority === "medium" ? "text-orange-600" : "text-green-600"
                  }`}>{issue.priority}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 border border-card-border/50">
                <Building2 className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Department</h4>
                  <p className="text-sm font-semibold text-text-primary line-clamp-1">{issue.department || "Unassigned"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 border border-card-border/50">
                <User className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Reported By</h4>
                  <p className="text-sm font-semibold text-text-primary">
                    {typeof issue.reportedBy === "object" ? (issue.reportedBy as any).name : issue.reportedBy || "Citizen"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 border border-card-border/50 sm:col-span-2">
                <Calendar className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Reported On</h4>
                  <p className="text-sm font-semibold text-text-primary">
                    {issue.reportedAt ? formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true }) : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2 border-b border-card-border/50 pb-2">
                  <MapPin className="w-3.5 h-3.5" /> Exact Location
                </h3>
                <div className="bg-black/5 rounded-[20px] p-5 border border-card-border/50 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-text-primary">{issue.location?.address || "Unknown Address"}</p>
                    {issue.location?.lat && (
                      <p className="text-xs text-text-secondary/60 font-mono mt-1 font-semibold">
                        {issue.location.lat.toFixed(5)}, {issue.location.lng.toFixed(5)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2 border-b border-card-border/50 pb-2">
                  <FileText className="w-3.5 h-3.5" /> Description
                </h3>
                <div className="bg-black/5 rounded-[20px] p-6 border border-card-border/50 shadow-sm">
                  <p className="text-[15px] text-text-primary leading-relaxed font-medium">{issue.description}</p>
                </div>
              </div>
            </div>

            {/* ─── ACTION REQUIRED (Sleek Banner) ─── */}
            {isInfoRequested && !hasResponded && (
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-[24px] p-1 shadow-lg shadow-yellow-500/20">
                <div className="bg-card-bg rounded-[20px] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="text-[15px] font-black uppercase tracking-widest text-yellow-600">Action Required</h3>
                  </div>
                  
                  {(issue as any).infoRequestMessage && (
                    <div className="mb-6">
                      <p className="text-sm font-bold text-yellow-600 leading-relaxed bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                        "{(issue as any).infoRequestMessage}"
                      </p>
                    </div>
                  )}

                  {!showProvideInfo ? (
                    <button
                      onClick={() => setShowProvideInfo(true)}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-yellow-500/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Provide Details
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        rows={4}
                        placeholder="Type your response to the authority here..."
                        value={infoText}
                        onChange={(e) => setInfoText(e.target.value)}
                        className="w-full bg-black/5 border border-yellow-500/30 rounded-xl p-4 text-[15px] font-medium text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50 shadow-sm"
                      />
                      <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-yellow-500/30 rounded-xl cursor-pointer hover:bg-black/5 transition-all text-xs font-black uppercase tracking-widest text-yellow-600 bg-transparent">
                        <Upload className="w-4 h-4" />
                        {infoImage ? infoImage.name : "Attach Image Evidence (Optional)"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setInfoImage(e.target.files?.[0] || null)} />
                      </label>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleProvideInfo}
                          disabled={submitting || !infoText.trim()}
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Submit</>}
                        </button>
                        <button
                          onClick={() => { setShowProvideInfo(false); setInfoText(""); setInfoImage(null); }}
                          className="px-6 py-4 bg-transparent border border-card-border rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-all shadow-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── Status Timeline ─── */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-text-secondary border-b border-card-border/50 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Resolution Journey
              </h3>
              <div className="bg-black/5 rounded-[20px] p-6 border border-card-border/50 shadow-sm">
                <StatusTimeline issue={issue} />
              </div>
            </div>

            {/* ─── Resolution Proof ─── */}
            {afterImageSrc && (
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-green-600 border-b border-card-border/50 pb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Official Resolution Proof
                </h3>
                <div className="bg-black/5 rounded-[24px] border border-green-500/20 overflow-hidden shadow-sm">
                  <img src={afterImageSrc} alt="Resolution Proof" className="w-full h-56 object-cover" />
                  {(issue as any).resolutionNotes && (
                    <div className="p-5 bg-green-500/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">Closing Notes</p>
                      <p className="text-[15px] font-medium text-green-700">{(issue as any).resolutionNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── Supplementary Info Image ─── */}
            {infoImageSrc && (
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-600 border-b border-card-border/50 pb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Supplementary Image Provided
                </h3>
                <div className="bg-black/5 rounded-[24px] border border-blue-500/20 overflow-hidden shadow-sm">
                  <img src={infoImageSrc} alt="Supplementary Info" className="w-full h-56 object-cover" />
                </div>
              </div>
            )}

        </div>
      </motion.div>
      </div>
    </AnimatePresence>
  );
}

