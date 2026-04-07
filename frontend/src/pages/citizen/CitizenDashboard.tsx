import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Eye, Plus, Search, Bell, User, LogOut, Filter, Clock, CheckCircle2, AlertCircle, MapPin, Loader2 } from "lucide-react";
import { statusConfig, categoryConfig } from "../../lib/constants";
import { type IssueStatus, type IssueCategory, type Issue } from "../../types";
import { api } from "../../services/api";
import { formatDistanceToNow } from "date-fns";

export function CitizenDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<IssueStatus | "all">("all");
  const [filterCategory, setFilterCategory] = useState<IssueCategory | "all">("all");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login/citizen");
      return;
    }
    setUser(JSON.parse(storedUser));

    const fetchIssues = async () => {
      try {
        const data = await api.getIssues();
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate("/");
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus;
    const matchesCategory = filterCategory === "all" || issue.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: issues.length,
    submitted: issues.filter(i => i.status === "submitted").length,
    inProgress: issues.filter(i => i.status === "in_progress").length,
    resolved: issues.filter(i => i.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-[#FF6B35]" />
              <span className="text-lg font-semibold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
                SpotFix
              </span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-3">
              <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={handleLogout}>
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 text-[#FF9933] animate-spin mb-4" />
            <p className="text-gray-600">Loading your reports...</p>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Citizen"}!</h1>
              <p className="text-gray-600">Track your reported issues and make your city better</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Reports"
                value={stats.total}
                icon={<AlertCircle className="h-5 w-5 text-blue-600" />}
                color="blue"
              />
              <StatCard
                title="Submitted"
                value={stats.submitted}
                icon={<Clock className="h-5 w-5 text-gray-600" />}
                color="gray"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                icon={<Clock className="h-5 w-5 text-orange-600" />}
                color="orange"
              />
              <StatCard
                title="Resolved"
                value={stats.resolved}
                icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
                color="green"
              />
            </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="text-xl font-semibold mb-1 sm:mb-2">Found a civic issue?</h3>
                <p className="opacity-90 text-sm sm:text-base">Report it in less than 2 minutes and track its resolution</p>
              </div>
              <Link to="/citizen/report" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Plus className="h-5 w-5 mr-2" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as IssueStatus | "all")}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as IssueCategory | "all")}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="w-full sm:w-auto inline-flex">
              <TabsTrigger value="all" className="whitespace-nowrap">All Issues ({filteredIssues.length})</TabsTrigger>
              <TabsTrigger value="active" className="whitespace-nowrap">Active ({stats.submitted + stats.inProgress})</TabsTrigger>
              <TabsTrigger value="resolved" className="whitespace-nowrap">Resolved ({stats.resolved})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredIssues.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No issues found matching your filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {filteredIssues.filter(i => i.status !== "resolved").map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {filteredIssues.filter(i => i.status === "resolved").map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </TabsContent>
        </Tabs></>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    gray: "bg-gray-50 border-gray-200",
    orange: "bg-orange-50 border-orange-200",
    green: "bg-green-50 border-green-200",
  };

  return (
    <Card className={colorClasses[color as keyof typeof colorClasses]}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{title}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const categoryInfo = categoryConfig[issue.category];
  const statusInfo = statusConfig[issue.status];

  return (
    <Link to={`/issue/${issue.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-500">#{issue.id.slice(-6).toUpperCase()}</span>
                <Badge
                  style={{ backgroundColor: statusInfo.color }}
                  className="ml-4 text-white"
                >
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" style={{ borderColor: categoryInfo.color, color: categoryInfo.color }}>
                    {categoryInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{issue.location.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDistanceToNow(issue.reportedAt, { addSuffix: true })}</span>
                </div>
              </div>

              {issue.status === "in_progress" && issue.assignedTo && (
                <div className="mt-3 text-sm text-blue-600">
                  Assigned to: {issue.assignedTo} • {issue.department}
                </div>
              )}

              {issue.status === "resolved" && issue.resolutionNotes && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                  <strong className="text-green-800">Resolution:</strong>{" "}
                  <span className="text-green-700">{issue.resolutionNotes}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}