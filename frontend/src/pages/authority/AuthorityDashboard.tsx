import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { MapPin, Bell, User, LogOut, Search, Filter, Clock, AlertTriangle, CheckCircle2, Upload, Eye, Loader2, UserPlus, ShieldCheck } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { statusConfig, categoryConfig, departmentStats, monthlyData, categoryDistribution } from "../../lib/constants";
import { type IssueStatus, type Issue } from "../../types";
import { api } from "../../services/api";
import { RegistrationForm } from "../../components/forms/RegistrationForm";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { IssueMap } from "../../components/common/IssueMap";
import { AuthorityDetailModal } from "./components/AuthorityDetailModal";

export function AuthorityDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', title: 'New Report', message: 'A new high-priority pothole was reported on MG Road.', time: new Date() },
    { id: '2', title: 'Update', message: 'Admin verified your resolution for Log #8A8BCC.', time: new Date(Date.now() - 7200000) },
  ]);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login/authority");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchIssues();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate("/");
  };

  const fetchIssues = async () => {
    try {
      const data = await api.getDepartmentIssues();
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      toast.error("Unable to connect to the server. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = useMemo(() => issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || issue.priority === filterPriority;
    return matchesSearch && matchesPriority;
  }), [issues, searchQuery, filterPriority]);

  const stats = useMemo(() => ({
    pending: issues.filter(i => i.status === "submitted").length,
    inProgress: issues.filter(i => i.status === "in_progress").length,
    resolved: issues.filter(i => i.status === "resolved").length,
    highPriority: issues.filter(i => i.priority === "high").length,
  }), [issues]);

  // Pre-bucket issues by status once — avoids 6+ inline .filter() calls on every render
  const buckets = useMemo(() => ({
    pending:             filteredIssues.filter(i => i.status === "submitted"),
    inProgress:          filteredIssues.filter(i => i.status === "in_progress" || i.status === "info_requested"),
    pendingVerification: filteredIssues.filter(i => i.status === "pending_verification"),
    resolved:            filteredIssues.filter(i => i.status === "resolved"),
  }), [filteredIssues]);

  return (
    <div className="w-full h-screen relative flex flex-col font-sans overflow-hidden bg-bg-primary transition-colors duration-500 ethnic-pattern pb-12">
      {/* Decorative Background Elements — static, no pulse to avoid GPU overload */}
      <div className="absolute top-[5%] left-[5%] w-[40%] h-[30%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3 bg-card-bg backdrop-blur-xl px-5 py-3 rounded-2xl border border-card-border hover:bg-white/10 transition-all shadow-sm">
            <ShieldCheck className="h-5 w-5 text-text-secondary group-hover:text-blue-500 transition-colors" />
            <span className="text-text-primary font-black text-sm tracking-widest uppercase">Authority Desk</span>
          </Link>
          <div className="flex items-center gap-4 bg-card-bg backdrop-blur-xl px-3 py-2 rounded-2xl border border-card-border shadow-sm">
            <DropdownMenu onOpenChange={(open) => open && setUnreadCount(0)}>
              <DropdownMenuTrigger className="outline-none">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 text-text-secondary hover:text-blue-500 hover:bg-blue-500/10 rounded-xl">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-card-bg/95 backdrop-blur-2xl border-card-border p-4 rounded-3xl shadow-xl">
                <DropdownMenuLabel className="text-text-primary font-black uppercase tracking-widest mb-4 flex justify-between items-center px-2">
                  <span>Sector Alerts</span>
                  <span className="text-[10px] text-blue-500/50">Department Sync</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5 mb-4" />
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-3 px-1">
                  {notifications.map(n => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 rounded-2xl border border-white/5 bg-white/5 hover:bg-blue-500/10 transition-all cursor-default focus:bg-blue-500/10">
                      <div className="flex justify-between w-full">
                        <span className="text-blue-500 font-black text-[10px] uppercase tracking-tighter">{n.title}</span>
                        <span className="text-[9px] text-text-secondary font-medium">{format(n.time, 'HH:mm')}</span>
                      </div>
                      <p className="text-sm text-text-primary font-medium">{n.message}</p>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-text-secondary hover:text-blue-500 hover:bg-blue-500/10 rounded-xl">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-card-bg/95 backdrop-blur-2xl border-card-border p-4 rounded-3xl shadow-xl">
                <DropdownMenuLabel className="flex flex-col gap-1 px-2 mb-4">
                  <span className="text-text-primary font-black uppercase tracking-tight text-lg">{user?.name}</span>
                  <span className="text-text-secondary text-[10px] font-black uppercase tracking-widest">{user?.department}</span>
                  <span className="text-text-secondary text-xs font-medium lowercase opacity-70">{user?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5 mb-4" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Close Terminal</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-card-border mx-1"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform active:scale-90 transition-transform cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 max-w-[1600px] w-full mx-auto px-6 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-text-secondary font-black uppercase tracking-widest text-sm">Retrieving Sector Data...</p>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="flex flex-col mb-8 gap-1">
              <h1 className="text-3xl md:text-5xl font-black text-text-primary uppercase tracking-tighter">Sector Operations</h1>
              <p className="text-sm md:text-sm text-text-secondary font-bold uppercase tracking-widest">
                Department: <span className="text-blue-500">{user?.department || "Unassigned"}</span> • Operator: {user?.name}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <StatCard title="Pending Review" value={stats.pending} icon={<Clock className="h-5 w-5 text-text-secondary" />} color="gray" />
              <StatCard title="In Progress" value={stats.inProgress} icon={<Clock className="h-5 w-5 text-orange-500" />} color="orange" />
              <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} color="green" />
              <StatCard title="High Priority" value={stats.highPriority} icon={<AlertTriangle className="h-5 w-5 text-red-500" />} color="red" />
            </div>

            {/* Map View */}
            <Card className="mb-8 bg-card-bg border-card-border shadow-card-shadow rounded-[32px] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-text-primary font-black uppercase tracking-tight">Active Sector Map</CardTitle>
                <CardDescription className="text-text-secondary font-medium">Live geographic feed of assigned incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-[24px] overflow-hidden border border-black/5 shadow-inner">
                  <IssueMap issues={filteredIssues} className="h-64 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="mb-8 bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      placeholder="Search incident logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 rounded-2xl bg-bg-primary border-card-border focus:ring-blue-500/20 shadow-sm text-text-primary font-bold tracking-wide"
                    />
                  </div>
                  <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                    <SelectTrigger className="w-full md:w-[220px] h-14 rounded-2xl bg-bg-primary border-card-border focus:ring-blue-500/20 text-text-primary font-black uppercase tracking-widest text-[10px]">
                      <Filter className="h-4 w-4 mr-2 text-text-secondary" />
                      <SelectValue placeholder="Priority Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-card-bg border-card-border rounded-2xl shadow-xl">
                      <SelectItem value="all" className="font-bold focus:bg-blue-500/10 focus:text-blue-500">ALL PRIORITY</SelectItem>
                      <SelectItem value="high" className="font-bold focus:bg-red-500/10 focus:text-red-500">HIGH PRIORITY</SelectItem>
                      <SelectItem value="medium" className="font-bold focus:bg-orange-500/10 focus:text-orange-500">MEDIUM PRIORITY</SelectItem>
                      <SelectItem value="low" className="font-bold focus:bg-blue-500/10 focus:text-blue-500">LOW PRIORITY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Issues List */}
            <Tabs defaultValue="pending" className="space-y-6">
              <div className="overflow-x-auto pb-1 custom-scrollbar">
                <TabsList className="bg-card-bg/50 backdrop-blur-md border border-card-border p-1 rounded-2xl h-12 inline-flex shadow-sm gap-1">
                  <TabsTrigger value="pending" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                    Pending ({buckets.pending.length})
                  </TabsTrigger>
                  <TabsTrigger value="in_progress" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                    In Progress ({buckets.inProgress.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending_verification" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                    Awaiting Verify ({buckets.pendingVerification.length})
                  </TabsTrigger>
                  <TabsTrigger value="resolved" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                    Resolved ({buckets.resolved.length})
                  </TabsTrigger>
                  <TabsTrigger value="all" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-black/80 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                    All Logged ({filteredIssues.length})
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all ml-2 border border-blue-500/20">
                    <UserPlus className="h-3 w-3 mr-1" /> Provision
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="bg-card-bg/80 backdrop-blur-xl border border-card-border shadow-card-shadow rounded-[32px] overflow-hidden">
                <TabsContent value="pending" className="m-0 focus-visible:outline-none">
                  {buckets.pending.length === 0 ? <EmptyState /> : (
                    <div className="grid grid-cols-1 gap-4 p-6">
                      {buckets.pending.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="in_progress" className="m-0 focus-visible:outline-none">
                  {buckets.inProgress.length === 0 ? <EmptyState /> : (
                    <div className="grid grid-cols-1 gap-4 p-6">
                      {buckets.inProgress.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pending_verification" className="m-0 focus-visible:outline-none">
                  {buckets.pendingVerification.length === 0 ? <EmptyState /> : (
                    <div className="grid grid-cols-1 gap-4 p-6">
                      {buckets.pendingVerification.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="resolved" className="m-0 focus-visible:outline-none">
                  {buckets.resolved.length === 0 ? <EmptyState /> : (
                    <div className="grid grid-cols-1 gap-4 p-6">
                      {buckets.resolved.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="m-0 focus-visible:outline-none">
                  {filteredIssues.length === 0 ? <EmptyState /> : (
                    <div className="grid grid-cols-1 gap-4 p-6">
                      {filteredIssues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="register" className="m-0 p-6">
                  <div className="max-w-2xl mx-auto py-8">
                    <RegistrationForm userType="authority" />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </div>



      {selectedIssue && (
        <AuthorityDetailModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
          onIssueUpdate={(updated) => {
            setIssues(prev => prev.map(i => i.id === updated.id ? updated : i));
            setSelectedIssue(updated);
          }}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-text-secondary/30" />
      <p className="text-text-secondary font-black uppercase tracking-widest text-sm">No incidents match this filter.</p>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colorConfigs = {
    gray: { bg: "bg-bg-primary/50", border: "border-card-border", text: "text-text-primary", iconBg: "bg-bg-primary" },
    orange: { bg: "bg-orange-500/5", border: "border-orange-500/20", text: "text-orange-600", iconBg: "bg-orange-500/10" },
    green: { bg: "bg-green-500/5", border: "border-green-500/20", text: "text-green-600", iconBg: "bg-green-500/10" },
    red: { bg: "bg-red-500/5", border: "border-red-500/20", text: "text-red-600", iconBg: "bg-red-500/10" },
  };
  
  const config = colorConfigs[color as keyof typeof colorConfigs];

  return (
    <Card className={`bg-card-bg border ${config.border} shadow-card-shadow rounded-[32px] overflow-hidden group`}>
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">{title}</span>
          <div className={`p-3 rounded-xl border ${config.border} ${config.iconBg} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        </div>
        <div className={`text-3xl sm:text-5xl font-black mb-1 tracking-tighter ${config.text}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function IssueCard({
  issue,
  onClick,
}: {
  issue: Issue;
  onClick: () => void;
}) {
  const categoryInfo = (categoryConfig as any)[issue.category];
  const statusInfo = (statusConfig as any)[issue.status];
  
  const priorityColors = {
    low: "bg-blue-500 text-white",
    medium: "bg-orange-500 text-white",
    high: "bg-red-500 text-white",
  };

  const statusBorderColor = issue.status === 'submitted' ? 'border-blue-500' :
                           issue.status === 'in_progress' ? 'border-orange-500' :
                           issue.status === 'info_requested' ? 'border-yellow-500' :
                           issue.status === 'pending_verification' ? 'border-purple-500' :
                           'border-green-500';

  const upvoteCount = issue.upvotedBy?.length || 0;

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white/40 backdrop-blur-md rounded-2xl p-5 border border-card-border shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden border-l-[6px] ${statusBorderColor}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <Badge className={`${priorityColors[issue.priority]} uppercase font-black tracking-widest text-[9px] px-2 py-0.5 border-0 shadow-sm`}>
              {issue.priority}
            </Badge>
            <span className="text-[10px] font-black tracking-widest text-text-secondary/50 uppercase">#{issue.id.slice(-6)}</span>
            <span className="text-[10px] font-black tracking-widest text-text-secondary/50 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })}
            </span>
            {upvoteCount > 0 && (
              <span className="text-[10px] font-black tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {upvoteCount} Supporters
              </span>
            )}
          </div>
          
          <h3 className="font-black text-lg text-text-primary truncate uppercase tracking-tight">{issue.title}</h3>
          
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-2 bg-black/5 px-2 py-1 rounded-lg">
              <span className="text-sm">{categoryInfo?.emoji}</span>
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">{categoryInfo?.label}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/5 px-2 py-1 rounded-lg flex-1 min-w-0">
              <MapPin className="w-3 h-3 text-blue-500" />
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider truncate">{issue.location.address}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 flex-shrink-0 w-full sm:w-auto">
          <Badge
            style={{ backgroundColor: `${statusInfo.color}15`, color: statusInfo.color, border: `1px solid ${statusInfo.color}30` }}
            className="uppercase font-black tracking-widest text-[10px] px-4 py-1.5 rounded-xl whitespace-nowrap"
          >
            {statusInfo.label}
          </Badge>
          
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
            Examine Incident <Eye className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}