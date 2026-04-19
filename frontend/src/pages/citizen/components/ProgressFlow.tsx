import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Clock, Send, ShieldCheck, ArrowDown, AlertCircle, MessageSquare, Upload, Loader2 } from "lucide-react";
import { Issue } from "../../../types";
import { format } from "date-fns";
import { useState } from "react";
import { api } from "../../../services/api";
import { toast } from "sonner";

interface ProgressFlowProps {
  issue: Issue;
  onIssueUpdate?: (updatedIssue: Issue) => void;
}

export function ProgressFlow({ issue, onIssueUpdate }: ProgressFlowProps) {
  const [showProvideInfo, setShowProvideInfo] = useState(false);
  const [infoText, setInfoText] = useState("");
  const [infoImage, setInfoImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleProvideInfo = async () => {
    if (!infoText.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }
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
      if (onIssueUpdate) onIssueUpdate(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit information.");
    } finally {
      setSubmitting(false);
    }
  };

  const isInfoRequested = issue.status === "info_requested";
  const isPendingVerification = issue.status === "pending_verification";
  const isResolved = issue.status === "resolved";
  const isInProgress = issue.status === "in_progress";

  const steps = [
    {
      id: "submitted",
      title: "Report Submitted",
      description: "Incident logged and waiting for official review.",
      icon: <Send className="w-5 h-5 text-accent" />,
      active: true,
      completed: !!issue.updatedAt,
      time: issue.reportedAt,
    },
    {
      id: "forwarded",
      title: "Forwarded for Action",
      description: issue.department
        ? `Forwarded to ${issue.department.toUpperCase()} department.`
        : "Assigned to the relevant department.",
      icon: <ShieldCheck className="w-5 h-5 text-accent-secondary" />,
      active: !!issue.department || isInProgress || isResolved || isInfoRequested || isPendingVerification,
      completed: !!issue.assignedTo,
      subText: issue.assignedTo ? `${(issue as any).assignedType === "contractor" ? "Contractor" : "Officer"}: ${issue.assignedTo}` : null,
    },
    {
      id: "in_progress",
      title: "Resolution In Progress",
      description: "Field team is actively working on the reported issue.",
      icon: <Clock className="w-5 h-5 text-accent" />,
      active: isInProgress || isResolved || isInfoRequested || isPendingVerification,
      completed: isResolved || isPendingVerification,
    },
    {
      id: "info_requested",
      title: "More Information Needed",
      description: (issue as any).infoRequestMessage || "The authority has requested additional information from you.",
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      active: isInfoRequested || !!(issue as any).infoRequestMessage,
      completed: !!(issue as any).infoProvidedMessage,
      highlight: isInfoRequested && !(issue as any).infoProvidedMessage,
    },
    {
      id: "pending_verification",
      title: "Awaiting Admin Verification",
      description: "Resolution proof submitted. Admin is reviewing the work.",
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      active: isPendingVerification || isResolved,
      completed: isResolved,
    },
    {
      id: "resolved",
      title: "Successfully Resolved",
      description: (issue as any).resolutionNotes || "Issue has been fixed and closed.",
      icon: <CheckCircle2 className="w-5 h-5 text-accent-secondary" />,
      active: isResolved,
      completed: isResolved,
    },
  ];

  // Only show steps that are active or completed
  const visibleSteps = steps.filter(s => s.active || s.completed);

  return (
    <div className="mt-4 pt-4 border-t border-card-border relative">
      <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-text-secondary mb-4 text-center">
        Real-time Resolution Path
      </h4>

      <div className="relative max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {/* Progress Line */}
        <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-card-border">
          <motion.div
            className="absolute top-0 w-full bg-gradient-to-b from-accent to-accent-secondary"
            initial={{ height: 0 }}
            animate={{
              height: isResolved ? "100%" :
                isPendingVerification ? "80%" :
                isInfoRequested ? "60%" :
                isInProgress ? "50%" :
                issue.department ? "25%" : "0%"
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>

        <div className="space-y-6">
          {visibleSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-6 relative z-10 ${!step.active ? "opacity-30" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                  (step as any).highlight
                    ? "bg-yellow-500/10 border-2 border-yellow-500/50"
                    : step.active
                    ? "bg-card-bg border border-accent/20 shadow-sm"
                    : "bg-bg-primary border border-card-border"
                } ${step.completed ? "ring-2 ring-accent/10" : ""}`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-accent-secondary" />
                ) : (
                  <div className={step.active ? "animate-pulse" : ""}>
                    {/* Resize icons inline */}
                    {step.icon}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h5
                    className={`text-sm font-black uppercase tracking-tight ${
                      (step as any).highlight ? "text-yellow-600" : step.active ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {step.title}
                  </h5>
                  {(step as any).time && (
                    <span className="text-[9px] font-bold text-text-secondary/50">
                      {format(new Date((step as any).time), "HH:mm")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary font-medium leading-relaxed">{step.description}</p>
                {(step as any).subText && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-accent/5 rounded-full border border-accent/10">
                    <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] text-accent font-black uppercase tracking-widest">{(step as any).subText}</span>
                  </div>
                )}

                {/* ── Citizen "Provide Info" action — shown only on info_requested step ── */}
                {step.id === "info_requested" && isInfoRequested && !(issue as any).infoProvidedMessage && (
                  <div className="mt-4">
                    {!showProvideInfo ? (
                      <button
                        onClick={() => setShowProvideInfo(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Provide Requested Information
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 bg-bg-primary border border-yellow-500/30 rounded-2xl p-4 space-y-3"
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600">Your Response</p>
                        <textarea
                          rows={3}
                          placeholder="Describe the additional information here..."
                          value={infoText}
                          onChange={(e) => setInfoText(e.target.value)}
                          className="w-full bg-card-bg border border-card-border rounded-xl p-3 text-sm text-text-primary font-medium resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                        />
                        <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-card-border rounded-xl cursor-pointer hover:bg-card-bg transition-all text-[10px] font-black uppercase tracking-widest text-text-secondary">
                          <Upload className="w-4 h-4" />
                          {infoImage ? infoImage.name : "Attach Image (Optional)"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setInfoImage(e.target.files?.[0] || null)}
                          />
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={handleProvideInfo}
                            disabled={submitting || !infoText.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><MessageSquare className="w-4 h-4" /> Submit</>}
                          </button>
                          <button
                            onClick={() => { setShowProvideInfo(false); setInfoText(""); setInfoImage(null); }}
                            className="px-4 py-2.5 border border-card-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Show what citizen already submitted */}
                {step.id === "info_requested" && (issue as any).infoProvidedMessage && (
                  <div className="mt-3 bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-green-600 mb-1">Your Response Submitted ✓</p>
                    <p className="text-xs text-text-secondary font-medium">{(issue as any).infoProvidedMessage}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic Wave Footer */}
      <div className="pt-4 flex justify-center">
        <ArrowDown className="w-4 h-4 text-accent/30 animate-bounce" />
      </div>
    </div>
  );
}
