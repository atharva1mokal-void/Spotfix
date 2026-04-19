import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, MapPin, Calendar, User, Building2, Clock, CheckCircle2, Loader2, Upload, AlertCircle, MessageSquare, ShieldCheck } from "lucide-react";
import { statusConfig, categoryConfig } from "../../lib/constants";
import { type Issue } from "../../types";
import { api } from "../../services/api";
import { format } from "date-fns";
import { ImageWithFallback } from "../../components/common/ImageWithFallback";
import { toast } from "sonner";
import { IssueMap } from "../../components/common/IssueMap";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

export function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Modal States
  const [modalType, setModalType] = useState<"request_info" | "provide_info" | "resolve" | "reject" | null>(null);
  const [modalText, setModalText] = useState("");
  const [modalImage, setModalImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchIssue = async () => {
      if (!id) return;
      try {
        const data = await api.getIssueById(id);
        setIssue(data);
      } catch (error) {
        console.error("Failed to fetch issue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return;
    try {
      await api.updateIssue(id, { status: newStatus as any });
      toast.success("Status updated");
      // Refresh issue data
      const data = await api.getIssueById(id);
      setIssue(data);
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  const handleModalSubmit = async () => {
    if (!id || !modalType) return;
    setSubmitting(true);
    
    try {
      if (modalType === "resolve") {
        // Authority uploads resolution proof → pending_verification
        if (!modalImage) {
          toast.error("Please upload a resolution photo");
          setSubmitting(false);
          return;
        }
        const formData = new FormData();
        formData.append("status", "pending_verification");
        formData.append("resolutionNotes", modalText);
        formData.append("updateImage", modalImage);
        await api.updateIssue(id, formData);

      } else if (modalType === "provide_info") {
        // Citizen provides additional info → back to in_progress so authority can continue
        const formData = new FormData();
        formData.append("status", "in_progress");
        formData.append("infoProvidedMessage", modalText);
        if (modalImage) formData.append("updateImage", modalImage);
        await api.updateIssue(id, formData);

      } else if (modalType === "request_info") {
        // Admin or Authority requests info from citizen
        await api.updateIssue(id, { status: "info_requested", infoRequestMessage: modalText } as any);

      } else if (modalType === "reject") {
        // Admin rejects resolution proof → send back to in_progress for rework
        await api.updateIssue(id, { status: "in_progress", adminVerificationNotes: modalText } as any);
      }

      toast.success("Issue updated successfully");
      setModalType(null);
      setModalText("");
      setModalImage(null);
      
      // Refresh issue data
      const data = await api.getIssueById(id);
      setIssue(data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
        <p className="text-text-secondary font-black uppercase tracking-widest text-sm">Decrypting Incident Data...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <ShieldCheck className="h-16 w-16 text-text-secondary/30 mb-4" />
        <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-2">Incident Not Found</h2>
        <p className="text-text-secondary font-medium mb-6">The requested log entry does not exist or has been purged.</p>
        <Link to="/citizen">
          <Button className="bg-accent hover:bg-accent-secondary text-white font-black uppercase tracking-widest px-8 h-12 rounded-xl">Return to Safety</Button>
        </Link>
      </div>
    );
  }

  const categoryInfo = (categoryConfig as any)[issue.category];
  const statusInfo = (statusConfig as any)[issue.status];

  return (
    <div className="min-h-screen bg-bg-primary relative flex flex-col font-sans overflow-hidden ethnic-pattern pb-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-[10%] right-[10%] w-[30%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-[1400px] mx-auto">
          <Link to={user?.userType === "authority" ? "/authority" : user?.userType === "admin" ? "/admin" : "/citizen"} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-accent bg-card-bg border border-card-border px-4 py-2 rounded-xl transition-all shadow-sm">
            <ArrowLeft className="h-4 w-4" />
            RETURN TO TERMINAL
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex-1 max-w-[1400px] w-full mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20 uppercase">LOG #{issue.id.slice(-6)}</span>
                <Badge className={`${
                  issue.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  issue.priority === 'medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                  'bg-blue-500/10 text-blue-500 border-blue-500/20'
                } uppercase font-black tracking-widest text-[10px]`}>
                  {issue.priority} PRIORITY
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-text-primary uppercase tracking-tighter">{issue.title}</h1>
            </div>
            <div className="flex items-center gap-3 bg-card-bg p-3 rounded-2xl border border-card-border shadow-sm">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: statusInfo.color }}></div>
              <span className="text-sm font-black tracking-widest uppercase" style={{ color: statusInfo.color }}>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Photo Evidence */}
            <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px] overflow-hidden">
              <CardHeader className="border-b border-card-border bg-bg-primary/50 py-4">
                <CardTitle className="text-text-primary font-black uppercase tracking-tight text-sm">Visual Evidence</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ImageWithFallback
                  src={issue.imageUrl ? `${API_BASE}${issue.imageUrl}` : getIssueImage(issue.category)}
                  alt={issue.title}
                  className="w-full h-[400px] object-cover"
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
              <CardHeader className="border-b border-card-border bg-bg-primary/50 py-4">
                <CardTitle className="text-text-primary font-black uppercase tracking-tight text-sm">Incident Description</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-text-secondary font-medium leading-relaxed text-lg">{issue.description}</p>
              </CardContent>
            </Card>

            {/* ─── AUTHORITY ACTIONS ─── */}
            {user?.userType === "authority" && (
              (issue.status === "submitted" || issue.status === "in_progress" || issue.status === "info_requested")
            ) && (
              <Card className="border-blue-500/30 bg-blue-500/5 shadow-card-shadow rounded-[32px] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <CardHeader className="py-4">
                  <CardTitle className="text-blue-500 font-black uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> Authority Directives
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 flex-wrap">
                  {issue.status === "submitted" && (
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20" onClick={() => handleStatusUpdate("in_progress")}>
                      Initiate Protocol (Start Work)
                    </Button>
                  )}
                  {(issue.status === "in_progress" || issue.status === "info_requested") && (
                    <>
                      <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20" onClick={() => setModalType("request_info")}>
                        Request Intel from Citizen
                      </Button>
                      <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-500/20" onClick={() => setModalType("resolve")}>
                        Upload Proof of Resolution
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

{/* ─── ADMIN ACTIONS ─── */}
            {user?.userType === "admin" && (
              <Card className="border-purple-500/30 bg-purple-500/5 shadow-card-shadow rounded-[32px] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <CardHeader className="py-4">
                  <CardTitle className="text-purple-500 font-black uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> Admin Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 flex-wrap">
                  {/* Pending verification: verify or reject */}
                  {issue.status === "pending_verification" && (
                    <>
                      <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-500/20" onClick={() => handleStatusUpdate("resolved")}>
                        Verify & Close Log
                      </Button>
                      <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20" onClick={() => setModalType("reject")}>
                        Reject — Send Back for Rework
                      </Button>
                    </>
                  )}
                  {/* In progress or info requested: admin can request more info from citizen */}
                  {(issue.status === "in_progress" || issue.status === "info_requested" || issue.status === "submitted") && (
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20" onClick={() => setModalType("request_info")}>
                      Request Intel from Citizen
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {(user?.userType === "citizen" && issue.status === "info_requested") && (
              <Card className="border-orange-500/30 bg-orange-500/5 shadow-card-shadow rounded-[32px] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <CardHeader className="py-4">
                  <CardTitle className="text-orange-500 font-black uppercase tracking-tight flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" /> Information Requested
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-bg-primary/80 border border-card-border p-4 rounded-2xl mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Authority Message</p>
                    <p className="text-text-primary font-bold">{issue.infoRequestMessage}</p>
                  </div>
                  <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20" onClick={() => setModalType("provide_info")}>
                    Provide Intelligence
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Information Provided by Citizen */}
            {(issue.infoProvidedMessage || issue.infoImageUrl) && (
              <Card className="border-blue-500/30 bg-blue-500/5 shadow-card-shadow rounded-[32px] overflow-hidden relative mt-8">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <CardHeader className="py-4">
                  <CardTitle className="text-blue-500 font-black uppercase tracking-tight flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" /> Supplementary Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {issue.infoProvidedMessage && (
                    <div className="bg-bg-primary/80 border border-card-border p-4 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Citizen Statement</p>
                      <p className="text-text-primary font-bold">{issue.infoProvidedMessage}</p>
                    </div>
                  )}
                  {issue.infoImageUrl && (
                    <ImageWithFallback
                      src={`${API_BASE}${issue.infoImageUrl}`}
                      alt="Supplementary Information"
                      className="w-full h-64 object-cover rounded-[24px] border border-blue-500/30"
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resolution Notes & Proof Image */}
            {(issue.resolutionNotes || issue.afterImageUrl) && (
              <Card className="border-green-500/30 bg-green-500/5 shadow-card-shadow rounded-[32px] overflow-hidden relative mt-8">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <CardHeader className="py-4">
                  <CardTitle className="text-green-500 font-black uppercase tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Verified Resolution Proof
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {issue.resolutionNotes && (
                    <div className="bg-bg-primary/80 border border-card-border p-4 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Authority Statement</p>
                      <p className="text-text-primary font-bold">{issue.resolutionNotes}</p>
                    </div>
                  )}
                  {issue.afterImageUrl && (
                    <ImageWithFallback
                      src={`${API_BASE}${issue.afterImageUrl}`}
                      alt="Resolution Proof"
                      className="w-full h-64 object-cover rounded-[24px] border border-green-500/30 shadow-lg"
                    />
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Admin Verification Notes */}
            {issue.adminVerificationNotes && issue.status !== "resolved" && (
              <Card className="border-red-500/30 bg-red-500/5 shadow-card-shadow rounded-[32px] overflow-hidden relative mt-8">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <CardHeader className="py-4">
                  <CardTitle className="text-red-500 font-black uppercase tracking-tight flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" /> Admin Rejection Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-bg-primary/80 border border-card-border p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Reason for Rejection</p>
                    <p className="text-text-primary font-bold">{issue.adminVerificationNotes}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Timeline */}
            <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
              <CardHeader className="border-b border-card-border bg-bg-primary/50 py-4">
                <CardTitle className="text-text-primary font-black uppercase tracking-tight text-sm">Chronological Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-2">
                  <TimelineItem status="submitted" date={issue.reportedAt} description="Incident ingested into the system." isCompleted={true} />
                  {issue.status !== "submitted" && (
                    <TimelineItem status="in_progress" date={issue.updatedAt} description={issue.assignedTo ? `Assigned to ${issue.assignedTo} at ${issue.department}` : "Field operation initiated."} isCompleted={true} />
                  )}
                  {(issue.status === "info_requested" || issue.infoRequestMessage) && (
                    <TimelineItem status="info_requested" date={issue.updatedAt} description={`Intel requested: "${issue.infoRequestMessage}"`} isCompleted={true} />
                  )}
                  {(issue.status === "pending_verification" || issue.status === "resolved") && (
                    <TimelineItem status="pending_verification" date={issue.updatedAt} description="Proof of work uploaded. Awaiting high-level verification." isCompleted={true} />
                  )}
                  {issue.status === "resolved" && (
                    <TimelineItem status="resolved" date={issue.updatedAt} description="Verification successful. Incident closed." isCompleted={true} />
                  )}
                  {issue.status === "rejected" && (
                    <TimelineItem status="rejected" date={issue.updatedAt} description="Proof rejected. Work requires redo." isCompleted={true} />
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Key Information */}
            <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
              <CardHeader className="border-b border-card-border bg-bg-primary/50 py-4">
                <CardTitle className="text-text-primary font-black uppercase tracking-tight text-sm">Data Matrix</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <InfoItem icon={<Building2 className="h-5 w-5 text-accent" />} label="Classification">
                  <Badge variant="outline" style={{ borderColor: categoryInfo.color, color: categoryInfo.color }} className="uppercase font-black text-[9px] tracking-widest border px-2 py-1">
                    {categoryInfo.label}
                  </Badge>
                </InfoItem>
                <div className="h-px w-full bg-card-border"></div>
                <InfoItem icon={<User className="h-5 w-5 text-accent" />} label="Reporting Node">
                  <span className="text-text-primary font-bold">{issue.reportedBy?.name || issue.reportedBy}</span>
                </InfoItem>
                <div className="h-px w-full bg-card-border"></div>
                <InfoItem icon={<Calendar className="h-5 w-5 text-accent" />} label="Ingestion Time">
                  <span className="text-text-primary font-bold text-sm">{format(new Date(issue.reportedAt), "MMM dd, yyyy 'at' h:mm a")}</span>
                </InfoItem>
                <div className="h-px w-full bg-card-border"></div>
                <InfoItem icon={<Clock className="h-5 w-5 text-accent" />} label="Last Modified">
                  <span className="text-text-primary font-bold text-sm">{format(new Date(issue.updatedAt), "MMM dd, yyyy 'at' h:mm a")}</span>
                </InfoItem>
                <div className="h-px w-full bg-card-border"></div>
                <InfoItem icon={<MapPin className="h-5 w-5 text-accent" />} label="Coordinates">
                  <span className="text-text-primary font-bold text-sm leading-tight">{issue.location.address}</span>
                </InfoItem>
              </CardContent>
            </Card>

            {/* Assignment Info */}
            {issue.assignedTo && (
              <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
                <CardHeader className="border-b border-card-border bg-bg-primary/50 py-4">
                  <CardTitle className="text-text-primary font-black uppercase tracking-tight text-sm">Active Directives</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Sector Authority</p>
                    <p className="text-text-primary font-bold text-lg leading-none">{issue.department}</p>
                  </div>
                  <div className="h-px w-full bg-card-border"></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Assigned Operative</p>
                    <p className="text-text-primary font-bold text-lg leading-none">{issue.assignedTo}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Map */}
            <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px] overflow-hidden">
              <CardHeader className="border-b border-card-border bg-bg-primary/50 py-4">
                <CardTitle className="text-text-primary font-black uppercase tracking-tight text-sm">Geospatial Lock</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <IssueMap issues={[issue]} className="h-64 w-full" defaultCenter={[issue.location.lat, issue.location.lng]} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {modalType && (
        <Dialog open={true} onOpenChange={(open) => !open && setModalType(null)}>
          <DialogContent className="bg-card-bg border-card-border shadow-2xl rounded-[32px] p-8 max-w-md">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black text-text-primary uppercase tracking-tighter">
                {modalType === "request_info" && "Request Intel"}
                {modalType === "provide_info" && "Provide Intel"}
                {modalType === "resolve" && "Upload Proof"}
                {modalType === "reject" && "Reject Work"}
              </DialogTitle>
              <DialogDescription className="text-text-secondary font-medium">
                {modalType === "request_info" && "Specify the exact data required to proceed with operations."}
                {modalType === "provide_info" && "Upload supplementary evidence and statements."}
                {modalType === "resolve" && "Attach visual confirmation of task completion."}
                {modalType === "reject" && "Log the reasons for rejection."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {(modalType === "resolve" || modalType === "provide_info") && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                    {modalType === "resolve" ? "Visual Confirmation *" : "Supplementary Image (Optional)"}
                  </label>
                  <label className="border-2 border-dashed border-card-border rounded-[24px] p-8 text-center hover:bg-bg-primary/50 cursor-pointer flex flex-col items-center w-full transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setModalImage(e.target.files?.[0] || null)}
                    />
                    <Upload className="h-10 w-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-text-primary font-bold">
                      {modalImage ? modalImage.name : "Click to select file"}
                    </span>
                  </label>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                  {modalType === "resolve" ? "Operational Notes *" : "Statement *"}
                </label>
                <Textarea
                  placeholder="Enter details here..."
                  rows={4}
                  value={modalText}
                  onChange={(e) => setModalText(e.target.value)}
                  className="bg-bg-primary border-card-border rounded-2xl text-text-primary font-medium focus:ring-accent/20 h-32 resize-none"
                />
              </div>

              <div className="flex justify-end gap-4 pt-2">
                <Button variant="ghost" onClick={() => setModalType(null)} disabled={submitting} className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] text-text-secondary hover:text-text-primary hover:bg-bg-primary">
                  Abort
                </Button>
                <Button onClick={handleModalSubmit} disabled={submitting || !modalText || (modalType === "resolve" && !modalImage)} className="h-12 px-8 rounded-xl bg-accent hover:bg-accent-secondary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20">
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Transmit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function TimelineItem({ status, date, description, isCompleted }: { status: string; date: Date; description: string; isCompleted: boolean; }) {
  const statusColors = {
    submitted: "bg-blue-500",
    in_progress: "bg-orange-500",
    info_requested: "bg-yellow-500",
    pending_verification: "bg-purple-500",
    resolved: "bg-green-500",
    rejected: "bg-red-500",
  };
  
  const color = isCompleted ? statusColors[status as keyof typeof statusColors] || "bg-gray-500" : "bg-card-border";
  const textColor = isCompleted ? "text-text-primary" : "text-text-secondary/50";

  return (
    <div className="flex gap-6 group">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center relative ${color} ${isCompleted ? 'shadow-lg' : ''}`}>
          {isCompleted && <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ backgroundColor: color.replace('bg-', '') }}></div>}
          {isCompleted ? <CheckCircle2 className="h-5 w-5 text-white relative z-10" /> : <Clock className="h-5 w-5 text-text-secondary/50" />}
        </div>
        <div className={`w-1 h-full mt-3 rounded-full ${isCompleted ? color : 'bg-card-border'} opacity-30`}></div>
      </div>
      <div className="flex-1 pb-10">
        <p className={`font-black uppercase tracking-widest text-sm mb-1 ${textColor}`}>{status.replace("_", " ")}</p>
        <p className={`font-medium mb-1 ${isCompleted ? 'text-text-secondary' : 'text-text-secondary/50'}`}>{description}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/40">{format(new Date(date), "MMM dd, yyyy 'at' h:mm a")}</p>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode; }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 bg-bg-primary rounded-xl border border-card-border">{icon}</div>
      <div className="flex-1 mt-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">{label}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}

function getIssueImage(category: string): string {
  const images: Record<string, string> = {
    roads: "https://images.unsplash.com/photo-1694804304298-c79443f5e2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwcG90aG9sZSUyMHJvYWQlMjBkYW1hZ2V8ZW58MXx8fHwxNzczMjEzOTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    streetlights: "https://images.unsplash.com/photo-1770447323553-5cd1b6711134?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzdHJlZXRsaWdodCUyMG5pZ2h0fGVufDF8fHx8MTc3MzIwODA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    garbage: "https://images.unsplash.com/photo-1762805543739-861a9901a304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJiYWdlJTIwYmlucyUyMG92ZXJmbG93JTIwdHJhc2h8ZW58MXx8fHwxNzczMjEzOTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    water: "https://images.unsplash.com/photo-1639335875048-a14e75abc083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHBpcGUlMjBsZWFrJTIwc3RyZWV0fGVufDF8fHx8MTc3MzIxMzkwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    sanitation: "https://images.unsplash.com/photo-1762805543739-861a9901a304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJiYWdlJTIwYmlucyUyMG92ZXJmbG93JTIwdHJhc2h8ZW58MXx8fHwxNzczMjEzOTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    other: "https://images.unsplash.com/photo-1766101366109-a7fd9c01990a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpYyUyMGdvdmVybm1lbnQlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NzMyMTM5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  };
  return images[category] || images.other;
}
