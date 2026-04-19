import { useState } from "react";
import { X, Calendar, MapPin, Loader2, Info, CheckCircle2, ShieldCheck, User, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Issue } from "../../../types";
import { format } from "date-fns";
import { categoryConfig, statusConfig } from "../../../lib/constants";
import { api } from "../../../services/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

interface AuthorityDetailModalProps {
  issue: Issue;
  onClose: () => void;
  onIssueUpdate: (updatedIssue: Issue) => void;
}

export function AuthorityDetailModal({ issue, onClose, onIssueUpdate }: AuthorityDetailModalProps) {
  const catConfig = categoryConfig[issue.category as keyof typeof categoryConfig] as any;
  const statConfig = (statusConfig as any)[issue.status] as { label: string; color: string } | undefined;

  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<"request_info" | "resolve" | null>(null);
  const [modalText, setModalText] = useState("");
  const [modalImage, setModalImage] = useState<File | null>(null);

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const updatedIssue = await api.updateIssue(issue.id, { status: newStatus as any });
      toast.success("Status updated to " + newStatus.replace('_', ' '));
      onIssueUpdate(updatedIssue);
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async () => {
    if (!modalType) return;
    setLoading(true);
    
    try {
      if (modalType === "resolve") {
        if (!modalImage) {
          toast.error("Please upload a resolution photo");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("status", "pending_verification");
        formData.append("resolutionNotes", modalText);
        formData.append("updateImage", modalImage);
        const updatedIssue = await api.updateIssue(issue.id, formData);
        toast.success("Proof uploaded, pending verification");
        onIssueUpdate(updatedIssue);

      } else if (modalType === "request_info") {
        const updatedIssue = await api.updateIssue(issue.id, { status: "info_requested", infoRequestMessage: modalText } as any);
        toast.success("Information requested from citizen");
        onIssueUpdate(updatedIssue);
      }

      setModalType(null);
      setModalText("");
      setModalImage(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const reporterName = typeof issue.reportedBy === "object" ? (issue.reportedBy as any).name : issue.reportedBy;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full max-w-2xl bg-card-bg backdrop-blur-2xl rounded-[32px] border border-card-border shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
          style={{ maxHeight: "calc(100vh - 40px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-card-border/50 bg-black/5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20 uppercase">
                LOG #{issue.id.slice(-6)}
              </span>
              <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg border uppercase ${
                  issue.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  issue.priority === 'medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                  'bg-blue-500/10 text-blue-500 border-blue-500/20'
              }`}>
                {issue.priority} Priority
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 transition-colors text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto custom-scrollbar p-6 space-y-8">
            {/* Title & Status */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight leading-tight">
                {issue.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-black/5 border border-black/10">
                  {catConfig?.emoji} {catConfig?.label}
                </span>
                <span 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ backgroundColor: `${statConfig?.color}15`, color: statConfig?.color, border: `1px solid ${statConfig?.color}30` }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statConfig?.color }} />
                  {statConfig?.label}
                </span>
              </div>
            </div>

            {/* Main Image */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-card-border/50 bg-black/5 relative">
              {issue.imageUrl ? (
                <img
                  src={`${API_BASE}${issue.imageUrl}`}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {catConfig?.emoji}
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 border border-card-border/50">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Location</h4>
                  <p className="text-sm font-semibold text-text-primary">{issue.location?.address || "Unknown Location"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 border border-card-border/50">
                <Calendar className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Reported On</h4>
                  <p className="text-sm font-semibold text-text-primary">{format(new Date(issue.reportedAt), "MMM d, yyyy • h:mm a")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 border border-card-border/50 sm:col-span-2">
                <User className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Reported By</h4>
                  <p className="text-sm font-semibold text-text-primary">{reporterName || "Citizen"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-widest mb-3 border-b border-card-border/50 pb-2">
                Incident Description
              </h3>
              <p className="text-sm text-text-primary leading-relaxed bg-black/5 p-4 rounded-2xl border border-card-border/50">
                {issue.description}
              </p>
            </div>

            {/* Community Support List */}
            {issue.upvotedBy && (issue.upvotedBy as any).length > 0 && (
              <div>
                <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-widest mb-3 border-b border-card-border/50 pb-2 flex items-center justify-between">
                  Community Support
                  <span className="text-accent bg-accent/10 px-2 py-0.5 rounded-full">{(issue.upvotedBy as any).length} Citizens</span>
                </h3>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar p-1">
                  {(issue.upvotedBy as any).map((voter: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/5 border border-accent/10 text-[11px] font-bold text-text-primary">
                      <User className="w-3 h-3 text-accent" />
                      {typeof voter === 'object' ? voter.name : "Citizen"}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authority Actions */}
            <div className="border border-blue-500/30 bg-blue-500/5 shadow-sm rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="p-4 border-b border-blue-500/10">
                <h3 className="text-blue-500 font-black uppercase tracking-tight flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4" /> Authority Directives
                </h3>
              </div>
              <div className="p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
                {issue.status === "submitted" && (
                  <button 
                    disabled={loading}
                    className="w-full sm:w-auto flex-1 h-11 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2" 
                    onClick={() => handleStatusUpdate("in_progress")}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Protocol (Start Work)"}
                  </button>
                )}
                {(issue.status === "in_progress" || issue.status === "info_requested") && (
                  <>
                    <button 
                      className="w-full sm:w-auto flex-1 h-11 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center" 
                      onClick={() => setModalType("request_info")}
                    >
                      Request Intel
                    </button>
                    <button 
                      className="w-full sm:w-auto flex-1 h-11 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center" 
                      onClick={() => setModalType("resolve")}
                    >
                      Upload Proof
                    </button>
                  </>
                )}
                {issue.status === "pending_verification" && (
                  <div className="text-xs font-semibold text-blue-600 p-2 text-center w-full">
                    Awaiting admin verification for resolution proof.
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Info block (if info requested/provided) */}
            {(issue.infoRequestMessage || issue.infoProvidedMessage) && (
              <div>
                <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-3 border-b border-orange-200 pb-2">
                  Information Request Log
                </h3>
                <div className="space-y-3">
                  {issue.infoRequestMessage && (
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                      <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-1">You Requested:</p>
                      <p className="text-sm text-orange-900">{issue.infoRequestMessage}</p>
                    </div>
                  )}
                  {issue.infoProvidedMessage && (
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                      <p className="text-[10px] font-black text-green-800 uppercase tracking-widest mb-1">Citizen Replied:</p>
                      <p className="text-sm text-green-900">{issue.infoProvidedMessage}</p>
                      
                      {issue.infoImageUrl && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-green-200 shadow-sm max-w-sm">
                          <img 
                            src={`${API_BASE}${issue.infoImageUrl}`} 
                            alt="Supplementary info" 
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Resolution Proof Section */}
            {(issue.afterImageUrl || issue.resolutionNotes) && (
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-green-600 border-b border-card-border/50 pb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Resolution Proof
                </h3>
                <div className="bg-black/5 rounded-[24px] border border-green-500/20 overflow-hidden shadow-sm">
                  {issue.afterImageUrl && (
                    <img src={`${API_BASE}${issue.afterImageUrl}`} alt="Resolution Proof" className="w-full h-64 object-cover" />
                  )}
                  {issue.resolutionNotes && (
                    <div className="p-5 bg-green-500/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">Closing Notes</p>
                      <p className="text-[15px] font-medium text-green-700">{issue.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </motion.div>
      </div>

      {/* Action Modals */}
      <Dialog open={!!modalType} onOpenChange={() => setModalType(null)}>
        <DialogContent className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight mb-2">
              {modalType === "resolve" ? "Upload Resolution Proof" : "Request Information"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2 block">
                {modalType === "resolve" ? "Resolution Notes" : "What information do you need?"}
              </label>
              <Textarea
                placeholder={modalType === "resolve" ? "Describe the actions taken..." : "Please specify..."}
                value={modalText}
                onChange={(e: any) => setModalText(e.target.value)}
                className="bg-black/5 border-card-border rounded-xl resize-none h-24"
              />
            </div>
            
            {modalType === "resolve" && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2 block">
                  Photographic Proof (Required)
                </label>
                <div className="border-2 border-dashed border-card-border rounded-xl p-4 text-center hover:bg-black/5 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: any) => setModalImage(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {modalImage ? (
                    <span className="text-sm font-semibold text-text-primary">{modalImage.name}</span>
                  ) : (
                    <span className="text-sm font-medium text-text-secondary flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-text-secondary/50" />
                      Click to upload resolution image
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <Button 
              disabled={loading}
              onClick={handleModalSubmit}
              className={`w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] text-white ${
                modalType === "resolve" ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}
