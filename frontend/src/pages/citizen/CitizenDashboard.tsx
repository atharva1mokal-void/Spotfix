import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Bell, User, Loader2, FileText, CheckCircle2, Clock, AlertCircle, Info, Trash2, MapPin, Users, Trophy, LogOut } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { ReportCard } from "./components/ReportCard";
import { StatCard } from "./components/StatCard";
import { IssueMap } from "../../components/common/IssueMap";
import { ReportDetailModal } from "./components/ReportDetailModal";
import { api } from "../../services/api";
import { Issue, User as UserType } from "../../types";
import { toast } from "sonner";
import { Leaderboard } from "./components/Leaderboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { format } from "date-fns";

export function CitizenDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [communityIssues, setCommunityIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [selectedMapIssue, setSelectedMapIssue] = useState<Issue | null>(null);
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', title: 'System', message: 'Welcome to Spotfix! Start reporting local issues.', time: new Date() },
    { id: '2', title: 'Karma', message: 'You earned 10 Karma for supporting a road repair!', time: new Date(Date.now() - 3600000) },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login/citizen");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchAllIssues = async () => {
      try {
        const [myIssues, commIssues, profile] = await Promise.all([
          api.getMyIssues(),
          api.getCommunityIssues(),
          api.getUserProfile()
        ]);
        setIssues(myIssues);
        setCommunityIssues(commIssues);
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllIssues();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("x-auth-token");
    if (token) {
      let retries = 0;
      const MAX_RETRIES = 3;
      const eventSource = new EventSource(`${(import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/issues/stream?token=${token}`);

      eventSource.onmessage = (event) => {
        retries = 0; // reset on successful message
        const updatedIssue = JSON.parse(event.data);
        
        // Update issues list live
        setIssues(prev => prev.map(i => i.id === updatedIssue.id ? updatedIssue : i));
        
        // Custom message logic
        let message = `Your report "${updatedIssue.title}" status changed to ${updatedIssue.status.replace('_', ' ')}.`;
        let title = "Report Update";

        if (updatedIssue.status === 'in_progress') {
          title = "Report Forwarded";
          const dept = updatedIssue.department ? `the ${updatedIssue.department} department` : "the field team";
          if (updatedIssue.assignedTo) {
            const type = updatedIssue.assignedType === 'contractor' ? "Contractor" : "Officer";
            message = `Your report has been forwarded to ${dept} and assigned to ${type}: ${updatedIssue.assignedTo}.`;
          } else {
            message = `Your report has been forwarded to ${dept} for processing.`;
          }
        } else if (updatedIssue.status === 'resolved') {
          title = "Issue Resolved";
          message = `Great news! Your report "${updatedIssue.title}" has been resolved.`;
        } else if (updatedIssue.status === 'rejected') {
          title = "Report Update";
          message = `Your report "${updatedIssue.title}" was reviewed and reached a final status.`;
        }
        
        // Add to notifications
        const newNotification = {
          id: Date.now(),
          title: title,
          message: message,
          time: new Date(),
          issueId: updatedIssue.id
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Visual Pop-up (Sonner)
        toast.info(title, {
          description: newNotification.message,
          icon: <Info className="h-4 w-4 text-accent" />,
          duration: 5000,
        });
      };

      eventSource.onerror = () => {
        retries++;
        if (retries >= MAX_RETRIES) {
          console.error("SSE: max retries reached, closing connection.");
          eventSource.close();
        }
      };

      return () => {
        eventSource.close();
      };
    }
  }, [navigate]);

  const isCommunityTab = activeItem === 'Community Reports';

  // Memoize combined array so IssueMap doesn't remount on unrelated state changes
  const allIssues = useMemo(() => [...issues, ...communityIssues], [issues, communityIssues]);

  const sourceIssues = isCommunityTab ? communityIssues : issues;

  const filteredIssues = useMemo(() =>
    sourceIssues.filter((issue) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q);
    }),
    [sourceIssues, searchQuery]
  );

  const activeReports = useMemo(() => filteredIssues.filter(i => i.status !== 'resolved'), [filteredIssues]);

  const stats = useMemo(() => ({
    total: issues.length,
    active: issues.filter(i => i.status !== 'resolved').length,
    resolved: issues.filter(i => i.status === "resolved").length,
  }), [issues]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] z-10 relative">
          <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
          <p className="text-text-secondary text-base font-medium tracking-wide animate-pulse">Loading reports...</p>
        </div>
      );
    }

    switch (activeItem) {
      case 'Report Feed':
        return (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar z-10 relative">
            <h2 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">All Reports
              <span className="ml-3 text-[11px] font-black text-text-secondary/50 bg-card-bg border border-card-border px-3 py-1 rounded-full align-middle">{filteredIssues.length} total</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredIssues.map(issue => (
                <ReportCard
                  key={issue.id}
                  issue={issue}
                  onDelete={(id) => setIssues(prev => prev.filter(i => i.id !== id))}
                />
              ))}
            </div>
            {filteredIssues.length === 0 && (
              <div className="text-center py-24 text-text-secondary/40 font-black uppercase tracking-widest text-sm">No matching reports found.</div>
            )}
          </div>
        );
      case 'Map View':
        return (
          <div className="flex-1 h-full min-h-[600px] z-10 relative">
            <IssueMap 
              issues={allIssues}
              className="w-full h-full" 
              currentUserId={user?.id}
              onMarkerClick={(issue) => setSelectedMapIssue(issue)}
            />
          </div>
        );
      case 'Settings':
      case 'Support':
        return (
          <div className="flex-1 flex items-center justify-center text-text-secondary z-10 relative">
            <div className="bg-card-bg backdrop-blur-3xl p-16 rounded-[40px] border border-card-border shadow-2xl text-center">
              <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-4">{activeItem}</h2>
              <p className="font-medium tracking-wide">Interface expansion in progress.</p>
            </div>
          </div>
        );
      case 'Community Reports':
      case 'Dashboard':
      default:
        return (
          <div className="flex-1 flex flex-col gap-5 z-10 relative min-h-0 overflow-hidden">
            {/* Top Stats */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Reports" value={stats.total} icon={<FileText className="w-5 h-5"/>} color="blue" delay={0} />
              <StatCard label="Active" value={stats.active} icon={<AlertCircle className="w-5 h-5"/>} color="orange" delay={100} />
              <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5"/>} color="green" delay={200} />
              <div className="bg-card-bg backdrop-blur-md rounded-[28px] border border-card-border p-4 flex flex-col justify-center shadow-sm">
                 <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 opacity-50">Global Rank</p>
                 <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-black text-text-primary tracking-tight">Top 10</span>
                 </div>
              </div>
            </div>

            {/* Main Content: 60% reports / 40% map */}
            <div className="flex gap-5 flex-1 min-h-0 overflow-hidden">
              
              {/* Left Column: Leaderboard + Feed */}
              <div className="flex-[0.58] flex flex-col gap-5 overflow-hidden min-h-0">
                {/* Leaderboard Section */}
                <div className="max-h-[250px] overflow-y-auto custom-scrollbar bg-card-bg/50 backdrop-blur-md rounded-3xl border border-card-border p-5">
                   <Leaderboard />
                </div>

                {/* Active Reports Feed */}
                <div className="flex-1 flex flex-col rounded-3xl border border-card-border bg-card-bg/80 backdrop-blur-md shadow-sm overflow-hidden min-h-[300px]">
                  <div className="flex flex-col px-6 pt-5 pb-4 border-b border-card-border flex-shrink-0 gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-text-primary font-black text-base tracking-tight uppercase">
                        {isCommunityTab ? "Community Activity" : "My Report Feed"}
                      </h2>
                      <div className="flex items-center gap-2">
                        {sourceIssues.filter(i => i.status === 'info_requested').length > 0 && (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full">
                            {sourceIssues.filter(i => i.status === 'info_requested').length} Action Needed
                          </span>
                        )}
                        <span className="text-[9px] px-2.5 py-1 bg-accent/10 rounded-full text-accent font-black tracking-widest border border-accent/20">LIVE</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {activeReports.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-16 h-16 bg-card-bg border border-card-border rounded-2xl flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-text-secondary/30" />
                        </div>
                        <p className="text-text-primary font-bold text-sm">No active reports</p>
                        <p className="text-text-secondary text-xs mt-1">
                          {isCommunityTab ? "There are no community reports in your area yet." : "Reports you submit will appear here"}
                        </p>
                      </div>
                    ) : (
                      activeReports.map((report) => (
                        <ReportCard
                          key={report.id}
                          issue={report}
                          onDelete={(id) => setIssues(prev => prev.filter(i => i.id !== id))}
                        />
                      ))
                    )}
                  </div>
                  
                  {!isCommunityTab && (
                    <div className="px-4 pb-4 flex-shrink-0">
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to clear your entire report history? This action is permanent.")) {
                            try {
                              await api.clearHistory();
                              setIssues([]);
                              toast.success("History Cleared", { description: "Your reporting record has been removed.", icon: <Trash2 className="w-4 h-4 text-red-500" /> });
                            } catch (err: any) {
                              toast.error("Process Failed", { description: err.message });
                            }
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/8 hover:bg-red-500/15 text-red-500 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-red-500/15"
                      >
                        <Trash2 className="w-4 h-4" /> Clear History
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Map — 40% */}
              <div className="flex-[0.42] rounded-3xl border border-card-border overflow-hidden shadow-sm relative">
                <IssueMap 
                  issues={allIssues}
                  className="w-full h-full" 
                  currentUserId={user?.id}
                  onMarkerClick={(issue) => setSelectedMapIssue(issue)}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen relative flex flex-col font-sans overflow-hidden bg-bg-primary transition-colors duration-500 ethnic-pattern">
      {/* Ambient glow blobs — subtle, not distracting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/4 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-secondary/4 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Main Dashboard Container */}
      <div className="relative z-10 flex flex-col h-full max-w-[1800px] w-full mx-auto px-6 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between py-5 mb-2 px-2">
          <div>
            <h1 className="text-3xl font-black text-text-primary tracking-tighter uppercase leading-none">Citizen Dashboard</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest">
                Logged in as: <span className="text-accent">{user?.name || "Citizen"}</span>
              </p>
              <div className="h-1 w-1 rounded-full bg-text-secondary/30" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 rounded-full border border-accent/20">
                <span className="text-[9px] font-black text-accent uppercase tracking-widest">{userProfile?.karma || 0} Karma Points</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card-bg backdrop-blur-xl text-text-primary placeholder:text-text-secondary/40 pl-14 pr-4 py-4 rounded-2xl border border-card-border focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all shadow-sm"
              />
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-4 bg-card-bg backdrop-blur-xl px-5 py-3 rounded-2xl border border-card-border hover:bg-white/10 transition-all shadow-sm group">
              <DropdownMenu onOpenChange={(open) => {
                if (open) setUnreadCount(0);
              }}>
                <DropdownMenuTrigger className="relative outline-none cursor-pointer">
                  <Bell className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-card-bg animate-pulse"></span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-card-bg/95 backdrop-blur-2xl border-card-border p-4 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in duration-300">
                  <DropdownMenuLabel className="text-text-primary font-black uppercase tracking-widest mb-4 flex justify-between items-center px-2">
                    <span>Notifications</span>
                    <span className="text-[10px] text-accent/50">Recent Updates</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5 mb-4" />
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-3 px-1">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center text-text-secondary/30 font-black uppercase text-xs tracking-widest">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 rounded-2xl border border-white/5 bg-white/5 hover:bg-accent/10 transition-all cursor-default focus:bg-accent/10">
                          <div className="flex justify-between w-full">
                            <span className="text-accent font-black text-[10px] uppercase tracking-tighter">{n.title}</span>
                            <span className="text-[9px] text-text-secondary font-medium">{format(n.time, 'HH:mm')}</span>
                          </div>
                          <p className="text-sm text-text-primary font-medium leading-tight">{n.message}</p>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="w-px h-6 bg-card-border mx-1"></div>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent-secondary rounded-full flex items-center justify-center shadow-lg transform active:scale-90 transition-transform cursor-pointer">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-card-bg/95 backdrop-blur-2xl border-card-border p-4 rounded-3xl shadow-xl">
                  <DropdownMenuLabel className="flex flex-col gap-1 px-2 mb-4">
                    <span className="text-text-primary font-black uppercase tracking-tight text-lg">{user?.name || "Citizen"}</span>
                    <span className="text-text-secondary text-xs font-medium lowercase">{user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5 mb-4" />
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-accent/10 p-3 rounded-2xl border border-accent/20 text-center">
                      <p className="text-[10px] font-black uppercase text-accent mb-1">Karma</p>
                      <p className="text-xl font-black text-text-primary">{userProfile?.karma || 0}</p>
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 text-center">
                      <p className="text-[10px] font-black uppercase text-blue-500 mb-1">Level</p>
                      <p className="text-xl font-black text-text-primary">{Math.floor((userProfile?.karma || 0) / 100) + 1}</p>
                    </div>
                  </div>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Terminate Session</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Report New Issue Button */}
            <button 
              onClick={() => navigate('/citizen/report')}
              className="flex items-center gap-3 bg-gradient-to-r from-accent to-accent-secondary hover:shadow-accent/30 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg hover:-translate-y-1 transform active:scale-95"
            >
              <Plus className="w-6 h-6" />
              Submit Report
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex gap-8 flex-1 h-[calc(100vh-160px)] overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

          {/* Dynamic Render Section */}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
            {renderContent()}
          </div>
        </div>
      </div>
      


      {selectedMapIssue && (
        <ReportDetailModal 
          issue={selectedMapIssue} 
          onClose={() => setSelectedMapIssue(null)} 
          onIssueUpdate={(updated) => {
            // Update issue locally depending on whose it is
            if (issues.some(i => i.id === updated.id)) {
              setIssues(prev => prev.map(i => i.id === updated.id ? updated : i));
            } else {
              setCommunityIssues(prev => prev.map(i => i.id === updated.id ? updated : i));
            }
            setSelectedMapIssue(updated);
          }}
        />
      )}
    </div>
  );
}