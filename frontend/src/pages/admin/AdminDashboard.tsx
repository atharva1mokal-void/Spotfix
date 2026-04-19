import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Eye, Bell, User, LogOut, TrendingUp, TrendingDown, Activity, CheckCircle2, Clock,
  Download, MapPin, Loader2, UserPlus, Users, ShieldAlert, RefreshCw, AlertTriangle, ShieldCheck
} from "lucide-react";
import { type Issue } from "../../types";
import { RegistrationForm } from "../../components/forms/RegistrationForm";
import { IssueMap } from "../../components/common/IssueMap";
import { api } from "../../services/api";
import { toast } from "sonner";
import {
  BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF9933", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"];

const DEPARTMENTS = [
  "Public Works (PWD)",
  "Water Supply (CIDCO)",
  "Sanitation Department",
  "Electrical Department",
  "General Administration",
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reassigning, setReassigning] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { navigate("/login/admin"); return; }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchAllData();
  }, [navigate]);

  const handleLogout = () => { api.logout(); navigate("/"); };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [issueData, analyticsData, userData] = await Promise.all([
        api.getIssues(),
        api.getAnalytics(),
        api.getAllUsers(),
      ]);
      setIssues(issueData);
      setAnalytics(analyticsData);
      setAllUsers(userData);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      toast.error("Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async (issueId: string, department: string) => {
    setReassigning(issueId);
    try {
      await api.reassignIssue(issueId, department);
      toast.success(`Issue reassigned to ${department}`);
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message || "Failed to reassign issue");
    } finally {
      setReassigning(null);
    }
  };

  const handleToggleBan = async (userId: string, name: string) => {
    try {
      const result = await api.toggleBanUser(userId);
      toast.success(result.message);
      setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, isBanned: result.user.isBanned } : u));
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  // Build chart data from live analytics
  const categoryChartData = analytics?.categoryStats?.map((s: any) => ({
    category: s._id?.charAt(0).toUpperCase() + s._id?.slice(1),
    count: s.count,
  })) || [];

  const statusChartData = analytics?.statusStats?.map((s: any) => ({
    name: s._id?.replace("_", " "),
    value: s.count,
  })) || [];

  const monthlyChartData = analytics?.monthlyTrends?.map((m: any) => ({
    month: MONTH_NAMES[(m._id.month - 1) % 12],
    submitted: m.submitted,
    resolved: m.resolved,
  })) || [];

  const departmentChartData = analytics?.departmentStats?.map((d: any) => ({
    name: d._id?.replace(" (PWD)", "").replace(" (CIDCO)", ""),
    total: d.total,
    resolved: d.resolved,
    pending: d.pending,
  })) || [];

  const stats = analytics ? {
    total: analytics.totalIssues,
    resolved: analytics.resolvedIssues,
    pending: analytics.pendingIssues,
    resolutionRate: analytics.resolutionRate,
  } : { total: 0, resolved: 0, pending: 0, resolutionRate: 0 };

  return (
    <div className="w-full min-h-screen relative flex flex-col font-sans overflow-hidden bg-bg-primary transition-colors duration-500 ethnic-pattern pb-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-[0%] left-[0%] w-[30%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[0%] w-[30%] h-[40%] bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none" style={{ animationDelay: '2s'}}></div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3 bg-card-bg backdrop-blur-xl px-5 py-3 rounded-2xl border border-card-border hover:bg-white/10 transition-all shadow-sm">
            <ShieldCheck className="h-5 w-5 text-text-secondary group-hover:text-accent transition-colors" />
            <span className="text-text-primary font-black text-sm tracking-widest uppercase">Admin Terminal</span>
          </Link>
          <div className="flex items-center gap-4 bg-card-bg backdrop-blur-xl px-3 py-2 rounded-2xl border border-card-border shadow-sm">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-xl" onClick={fetchAllData}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-xl">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-card-border mx-1"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-secondary rounded-xl flex items-center justify-center shadow-lg transform active:scale-90 transition-transform cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 max-w-[1600px] w-full mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
            <p className="text-text-secondary font-black uppercase tracking-widest text-sm">Synchronizing Data Core...</p>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="flex flex-col mb-8 gap-1">
              <h1 className="text-3xl md:text-5xl font-black text-text-primary uppercase tracking-tighter">Command Center</h1>
              <p className="text-sm md:text-sm text-text-secondary font-bold uppercase tracking-widest">
                Welcome, <span className="text-accent">{user?.name}</span> • Global Civic Management Node
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <MetricCard title="Total Issues" value={stats.total.toLocaleString()} change="Live Sync" isPositive={false} icon={<Activity className="h-5 w-5" />} />
              <MetricCard title="Resolved Issues" value={stats.resolved.toLocaleString()} change="Live Sync" isPositive={true} icon={<CheckCircle2 className="h-5 w-5" />} />
              <MetricCard title="Pending Review" value={stats.pending.toLocaleString()} change="Live Sync" isPositive={true} icon={<Clock className="h-5 w-5" />} />
              <MetricCard title="Resolution Rate" value={`${stats.resolutionRate}%`} change="Live Sync" isPositive={true} icon={<TrendingUp className="h-5 w-5" />} />
            </div>
          </>
        )}

        <Tabs defaultValue="overview" className="space-y-8">
          <div className="overflow-x-auto pb-1 custom-scrollbar">
            <TabsList className="bg-card-bg border border-card-border p-1.5 rounded-2xl h-14 inline-flex shadow-sm">
              <TabsTrigger value="overview" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="issues" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-white">Global Feed ({issues.length})</TabsTrigger>
              <TabsTrigger value="departments" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-white">Departments</TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-white">
                <Users className="h-3 w-3 mr-1" />
                Access Control ({allUsers.length})
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-white">
                <UserPlus className="h-3 w-3 mr-1" />
                Provision Accounts
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── OVERVIEW TAB ── */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px] overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-text-primary font-black uppercase tracking-tight">Geospatial Distribution</CardTitle>
                  <CardDescription className="text-text-secondary font-medium">Live plot of all reported issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-[24px] overflow-hidden border border-black/5 shadow-inner">
                    <IssueMap issues={issues} className="h-[300px] w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
                <CardHeader>
                  <CardTitle className="text-text-primary font-black uppercase tracking-tight">Timeline Analytics</CardTitle>
                  <CardDescription className="text-text-secondary font-medium">Ingestion vs Resolution vectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyChartData.length > 0 ? monthlyChartData : [{ month: "No data", submitted: 0, resolved: 0 }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
                      <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="submitted" stroke="#FF9933" strokeWidth={3} name="Submitted" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="resolved" stroke="#138808" strokeWidth={3} name="Resolved" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Distribution Pie */}
              <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
                <CardHeader>
                  <CardTitle className="text-text-primary font-black uppercase tracking-tight">Status Metrics</CardTitle>
                  <CardDescription className="text-text-secondary font-medium">Issue lifecycle breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%" cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} (${value})`}
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusChartData.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Breakdown Bar Chart */}
              <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
                <CardHeader>
                  <CardTitle className="text-text-primary font-black uppercase tracking-tight">Incident Typology</CardTitle>
                  <CardDescription className="text-text-secondary font-medium">Classification vectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
                      <XAxis dataKey="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                      <Bar dataKey="count" fill="#FF9933" radius={[4, 4, 0, 0]}>
                        {categoryChartData.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── ALL ISSUES TAB ── */}
          <TabsContent value="issues" className="space-y-4">
            <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-text-primary font-black uppercase tracking-tight">Global Incident Feed</CardTitle>
                <CardDescription className="text-text-secondary font-medium">Re-route reports across internal departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {issues.length === 0 ? (
                    <div className="text-center py-16">
                      <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-text-secondary/30" />
                      <p className="text-text-secondary font-black uppercase tracking-widest text-sm">System Empty. Zero Active Threats.</p>
                    </div>
                  ) : (
                    issues.map((issue) => (
                      <div key={issue.id} className="border border-card-border bg-bg-primary/50 hover:bg-bg-primary rounded-[24px] p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="text-[10px] font-black tracking-widest text-accent bg-accent/10 px-2 py-1 rounded-md uppercase">#{issue.id?.slice(-6)}</span>
                            <span className="font-bold text-text-primary">{issue.title}</span>
                            <Badge className={
                              issue.status === "resolved" ? "bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wider text-[10px]" :
                              issue.status === "in_progress" ? "bg-accent hover:bg-accent-secondary text-white font-bold uppercase tracking-wider text-[10px]" :
                              issue.status === "rejected" ? "bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-wider text-[10px]" : "bg-gray-500 text-white font-bold uppercase tracking-wider text-[10px]"
                            }>{issue.status.replace("_", " ")}</Badge>
                          </div>
                          <div className="text-xs text-text-secondary font-medium flex flex-wrap gap-4 items-center">
                            <span className="flex items-center gap-1.5 bg-card-bg px-2 py-1 rounded-md border border-card-border"><MapPin className="h-3 w-3 text-accent" />{issue.location?.address}</span>
                            <span className="bg-card-bg px-2 py-1 rounded-md border border-card-border">Routing: <strong className="text-text-primary">{issue.department || "Unassigned"}</strong></span>
                            <span className="bg-card-bg px-2 py-1 rounded-md border border-card-border">Node: {typeof issue.reportedBy === 'object' ? issue.reportedBy.name : issue.reportedBy}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 min-w-fit bg-card-bg p-2 rounded-2xl border border-card-border shadow-sm">
                          <Select
                            defaultValue={issue.department || ""}
                            onValueChange={(dept) => handleReassign(issue.id, dept)}
                          >
                            <SelectTrigger className="w-[180px] h-10 text-[10px] font-black uppercase tracking-widest bg-bg-primary border-none focus:ring-accent/20 rounded-xl">
                              <SelectValue placeholder="REROUTE..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-card-border bg-card-bg shadow-xl">
                              {DEPARTMENTS.map(d => (
                                <SelectItem key={d} value={d} className="text-xs font-bold focus:bg-accent/10 focus:text-accent rounded-lg m-1 cursor-pointer">{d}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {reassigning === issue.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-accent mr-2" />
                          ) : (
                            <Link to={`/issue/${issue.id}`}>
                              <Button size="sm" className="h-10 px-6 rounded-xl bg-bg-secondary text-text-primary hover:bg-accent hover:text-white font-black uppercase tracking-widest text-[10px] transition-all">VIEW</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── DEPARTMENTS TAB ── */}
          <TabsContent value="departments" className="space-y-8">
            <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-text-primary font-black uppercase tracking-tight">Authority Matrix</CardTitle>
                <CardDescription className="text-text-secondary font-medium">Throughput & Resolution metrics per department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {departmentChartData.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-text-secondary font-black uppercase tracking-widest text-sm">Insufficient Data Points</p>
                    </div>
                  ) : (
                    departmentChartData.map((dept: any) => {
                      const rate = dept.total > 0 ? ((dept.resolved / dept.total) * 100).toFixed(1) : "0.0";
                      return (
                        <div key={dept.name} className="border border-card-border bg-bg-primary/30 rounded-[24px] p-6 hover:bg-bg-primary transition-colors">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-black text-text-primary uppercase tracking-tight text-lg">{dept.name}</h4>
                            <span className="text-[10px] font-black tracking-widest px-3 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">{rate}% SUCCESS</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-card-bg p-3 rounded-2xl border border-card-border text-center"><p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Assigned</p><p className="text-2xl font-black text-text-primary">{dept.total}</p></div>
                            <div className="bg-card-bg p-3 rounded-2xl border border-card-border text-center"><p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Cleared</p><p className="text-2xl font-black text-green-600">{dept.resolved}</p></div>
                            <div className="bg-card-bg p-3 rounded-2xl border border-card-border text-center"><p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">Pending</p><p className="text-2xl font-black text-accent">{dept.pending}</p></div>
                          </div>
                          <div className="w-full bg-card-border rounded-full h-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-accent to-accent-secondary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {departmentChartData.length > 0 && (
              <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
                <CardHeader>
                  <CardTitle className="text-text-primary font-black uppercase tracking-tight">Cross-Department Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={departmentChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
                      <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                      <Bar dataKey="total" fill="#FF9933" name="Assigned" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" fill="#22c55e" name="Cleared" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" fill="#ef4444" name="Pending" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── USERS TAB ── */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-text-primary font-black uppercase tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-xl"><Users className="h-6 w-6 text-accent" /></div>
                  Network Access Control
                </CardTitle>
                <CardDescription className="text-text-secondary font-medium">Monitor and sanction user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-text-secondary font-black uppercase tracking-widest text-sm">No active profiles.</p>
                    </div>
                  ) : (
                    allUsers.map((u: any) => (
                      <div key={u._id} className="border border-card-border bg-bg-primary/50 hover:bg-bg-primary rounded-[24px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner ${
                            u.userType === "admin" ? "bg-gradient-to-br from-red-500 to-red-600" :
                            u.userType === "authority" ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-green-500 to-green-600"
                          }`}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-text-primary text-lg tracking-tight">{u.name}</span>
                              {u.isBanned && <Badge className="bg-red-500 text-white uppercase font-black tracking-widest text-[10px]">Suspended</Badge>}
                            </div>
                            <p className="text-sm text-text-secondary font-medium mb-2">{u.email}</p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline" className={`uppercase font-black tracking-widest text-[9px] bg-card-bg ${
                                u.userType === "admin" ? "border-red-400 text-red-600" :
                                u.userType === "authority" ? "border-blue-400 text-blue-600" : "border-green-400 text-green-600"
                              }`}>{u.userType}</Badge>
                              {u.department && <Badge variant="outline" className="uppercase font-black tracking-widest text-[9px] bg-card-bg border-card-border text-text-secondary">{u.department}</Badge>}
                            </div>
                          </div>
                        </div>
                        {u.userType === "citizen" && (
                          <Button
                            size="sm"
                            className={`h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                              u.isBanned 
                                ? "bg-bg-secondary text-text-primary border border-card-border hover:bg-white/10" 
                                : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                            }`}
                            onClick={() => handleToggleBan(u._id, u.name)}
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            {u.isBanned ? "Restore Access" : "Revoke Access"}
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── PROVISION TAB ── */}
          <TabsContent value="register" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <RegistrationForm userType="authority" />
              <RegistrationForm userType="admin" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
}

function MetricCard({ title, value, change, isPositive, icon }: {
  title: string; value: string; change: string; isPositive: boolean; icon: React.ReactNode;
}) {
  return (
    <Card className="bg-card-bg border-card-border shadow-card-shadow rounded-[32px] overflow-hidden group">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">{title}</span>
          <div className="p-3 bg-bg-primary rounded-xl text-accent border border-card-border group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        <div className="text-3xl sm:text-5xl font-black text-text-primary mb-3 tracking-tighter">{value}</div>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full ${isPositive ? "bg-green-500/10 text-green-500" : "bg-accent/10 text-accent"}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isPositive ? "text-green-500" : "text-accent"}`}>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}