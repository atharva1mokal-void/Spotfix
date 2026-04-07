import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { MapPin, Bell, User, LogOut, Search, Filter, Clock, AlertTriangle, CheckCircle2, Upload, Eye, Loader2, UserPlus } from "lucide-react";
import { statusConfig, categoryConfig, departmentStats, monthlyData, categoryDistribution } from "../../lib/constants";
import { type IssueStatus, type Issue } from "../../types";
import { api } from "../../services/api";
import { RegistrationForm } from "../../components/forms/RegistrationForm";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function AuthorityDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login/authority");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.userType !== "authority") {
      navigate("/");
      return;
    }
    setUser(parsedUser);
    fetchIssues();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate("/");
  };

  const fetchIssues = async () => {
    try {
      const data = await api.getIssues();
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      toast.error("Unable to connect to the server. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || issue.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const stats = {
    pending: issues.filter(i => i.status === "submitted").length,
    inProgress: issues.filter(i => i.status === "in_progress").length,
    resolved: issues.filter(i => i.status === "resolved").length,
    highPriority: issues.filter(i => i.priority === "high").length,
  };

  const handleUpdateStatus = async (issueId: string, newStatus: IssueStatus) => {
    try {
      await api.updateIssue(issueId, { status: newStatus });
      toast.success(`Issue #${issueId} status updated to ${statusConfig[newStatus].label}`);
      setSelectedIssue(null);
      fetchIssues(); // Refresh list
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-[#FF6B35]" />
              <span className="text-lg font-semibold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
                SpotFix Authority
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
            <p className="text-gray-600">Loading issues...</p>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Authority Dashboard</h1>
              <p className="text-gray-600">Manage and resolve civic issues reported by citizens</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Pending Review"
                value={stats.pending}
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
              <StatCard
                title="High Priority"
                value={stats.highPriority}
                icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
                color="red"
              />
            </div>

        {/* Map View Placeholder */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>City Issue Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-blue-200/20"></div>
                ))}
              </div>
              {/* Simulated markers */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute top-2/3 left-2/3 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 left-2/4 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="text-center z-10">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-800">Interactive Map View</p>
                <p className="text-xs text-blue-600">Showing {issues.length} reported issues</p>
              </div>
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
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <Tabs defaultValue="pending" className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="w-full sm:w-auto inline-flex">
              <TabsTrigger value="pending" className="whitespace-nowrap">
                Pending ({filteredIssues.filter(i => i.status === "submitted").length})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="whitespace-nowrap">
                In Progress ({filteredIssues.filter(i => i.status === "in_progress").length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="whitespace-nowrap">
                Resolved ({filteredIssues.filter(i => i.status === "resolved").length})
              </TabsTrigger>
              <TabsTrigger value="all" className="whitespace-nowrap">
                All ({filteredIssues.length})
              </TabsTrigger>
              <TabsTrigger value="register" className="whitespace-nowrap">
                <UserPlus className="h-4 w-4 mr-1 sm:mr-2" />
                Register
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pending" className="space-y-4">
            {filteredIssues.filter(i => i.status === "submitted").map((issue) => (
              <AuthorityIssueCard
                key={issue.id}
                issue={issue}
                onSelect={setSelectedIssue}
              />
            ))}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            {filteredIssues.filter(i => i.status === "in_progress").map((issue) => (
              <AuthorityIssueCard
                key={issue.id}
                issue={issue}
                onSelect={setSelectedIssue}
              />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {filteredIssues.filter(i => i.status === "resolved").map((issue) => (
              <AuthorityIssueCard
                key={issue.id}
                issue={issue}
                onSelect={setSelectedIssue}
              />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {filteredIssues.map((issue) => (
              <AuthorityIssueCard
                key={issue.id}
                issue={issue}
                onSelect={setSelectedIssue}
              />
            ))}
          </TabsContent>
            <TabsContent value="register">
              <RegistrationForm userType="authority" />
            </TabsContent>
          </Tabs>
          </>
        )}
      </div>

      {/* Update Issue Dialog */}
      {selectedIssue && (
        <UpdateIssueDialog
          issue={selectedIssue}
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    gray: "bg-gray-50 border-gray-200",
    orange: "bg-orange-50 border-orange-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
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

function AuthorityIssueCard({
  issue,
  onSelect,
}: {
  issue: Issue;
  onSelect: (issue: Issue) => void;
}) {
  const categoryInfo = categoryConfig[issue.category];
  const statusInfo = statusConfig[issue.status];
  
  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-gray-500">#{issue.id.slice(-6).toUpperCase()}</span>
                  <h3 className="font-semibold text-lg">{issue.title}</h3>
                  <Badge className={priorityColors[issue.priority]}>
                    {issue.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{issue.description}</p>
              </div>
              <Badge
                style={{ backgroundColor: statusInfo.color }}
                className="ml-4 text-white"
              >
                {statusInfo.label}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{issue.reportedBy}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => onSelect(issue)}>
                Manage Issue
              </Button>
              <Link to={`/issue/${issue.id}`}>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpdateIssueDialog({
  issue,
  isOpen,
  onClose,
  onUpdate,
}: {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (issueId: string, status: IssueStatus) => void;
}) {
  const [newStatus, setNewStatus] = useState<IssueStatus>(issue.status);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleSubmit = () => {
    onUpdate(issue.id, newStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Issue Status</DialogTitle>
          <DialogDescription>
            Issue: {issue.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Status</label>
            <div>
              <Badge style={{ backgroundColor: statusConfig[issue.status].color }} className="text-white">
                {statusConfig[issue.status].label}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Update Status To</label>
            <Select value={newStatus} onValueChange={(value: IssueStatus) => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newStatus === "in_progress" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign To</label>
              <Input placeholder="Officer name" defaultValue={issue.assignedTo || ""} />
            </div>
          )}

          {newStatus === "resolved" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution Notes</label>
                <Textarea
                  placeholder="Describe the actions taken to resolve this issue..."
                  rows={4}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">After Resolution Photo</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload resolution photo</p>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Update Status
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}