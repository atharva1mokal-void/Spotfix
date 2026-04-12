import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Eye,
  Bell,
  User,
  LogOut,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Download,
  MapPin,
  Loader2,
  UserPlus,
  Home,
} from "lucide-react";
import { Navbar, NavItem } from "../../components/ui/Navbar";
import { departmentStats, monthlyData, categoryDistribution } from "../../lib/constants";
import { type Issue } from "../../types";
import { RegistrationForm } from "../../components/forms/RegistrationForm";
import { api } from "../../services/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login/admin");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.userType !== "admin") {
      navigate("/");
      return;
    }
    setUser(parsedUser);
    
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

  const stats = {
    total: issues.length,
    resolved: issues.filter(i => i.status === "resolved").length,
    pending: issues.filter(i => i.status === "submitted" || i.status === "in_progress").length,
    resolutionRate: issues.length > 0 ? Math.round((issues.filter(i => i.status === "resolved").length / issues.length) * 100) : 0,
  };
  const navItems: NavItem[] = [
    { label: "Overview", href: "/admin", icon: Home },
    { label: "Export", href: "#", icon: Download, isButton: true },
    { label: "Notifications", href: "#", icon: Bell, isButton: true },
    { label: "Profile", href: "#", icon: User, isButton: true },
    { label: "Logout", href: "#", icon: LogOut, isButton: true, onClick: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20 md:pb-0">
      <Navbar items={navItems} />
      {/* Minimalistic Header for Logo */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Eye className="h-6 w-6 text-[#FF6B35]" />
          <span className="text-lg font-semibold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
            SpotFix Admin
          </span>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 text-[#FF9933] animate-spin mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Analytics & Insights</h1>
                <p className="text-sm md:text-base text-gray-600">Comprehensive overview of civic issue management</p>
              </div>
              <Select defaultValue="7days">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <MetricCard
                title="Total Issues"
                value={stats.total.toLocaleString()}
                change="+12.5%"
                isPositive={false}
                icon={<Activity className="h-5 w-5" />}
              />
              <MetricCard
                title="Resolved Issues"
                value={stats.resolved.toLocaleString()}
                change="+8.2%"
                isPositive={true}
                icon={<CheckCircle2 className="h-5 w-5" />}
              />
              <MetricCard
                title="Pending Review"
                value={stats.pending.toLocaleString()}
                change="-5.4%"
                isPositive={true}
                icon={<Clock className="h-5 w-5" />}
              />
              <MetricCard
                title="Resolution Rate"
                value={`${stats.resolutionRate}%`}
                change="+2.1%"
                isPositive={true}
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </div>
          </>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="w-full sm:w-auto inline-flex">
              <TabsTrigger value="overview" className="whitespace-nowrap">Overview</TabsTrigger>
              <TabsTrigger value="departments" className="whitespace-nowrap">Departments</TabsTrigger>
              <TabsTrigger value="heatmap" className="whitespace-nowrap">Heatmap</TabsTrigger>
              <TabsTrigger value="register" className="whitespace-nowrap">
                <UserPlus className="h-4 w-4 mr-1 sm:mr-2" />
                Register
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Issues submitted vs resolved over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2} name="Submitted" />
                      <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Issue Categories</CardTitle>
                  <CardDescription>Distribution by category type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category} (${percentage}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Detailed view of issues by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6">
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Resolution metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {departmentStats.map((dept) => (
                    <DepartmentCard key={dept.name} department={dept} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
                <CardDescription>Total vs resolved issues by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-15} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3b82f6" name="Total Issues" />
                    <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>City-Wide Issue Heatmap</CardTitle>
                <CardDescription>Identify problem hotspots across the city</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
                    {Array.from({ length: 144 }).map((_, i) => {
                      const intensity = Math.random();
                      const color =
                        intensity > 0.7
                          ? "bg-red-500/40"
                          : intensity > 0.5
                          ? "bg-orange-500/40"
                          : intensity > 0.3
                          ? "bg-yellow-500/30"
                          : "bg-green-500/20";
                      return <div key={i} className={`border border-white/20 ${color}`}></div>;
                    })}
                  </div>
                  <div className="z-10 bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center">
                    <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Interactive Heatmap</h3>
                    <p className="text-sm text-gray-600 max-w-md">
                      Visualize issue density across different city zones. Red areas indicate high-priority zones
                      requiring immediate attention.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Zones */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">High Priority Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Downtown Area</span>
                      <span className="font-semibold">24 issues</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Industrial District</span>
                      <span className="font-semibold">18 issues</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Old Town</span>
                      <span className="font-semibold">15 issues</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">Medium Priority Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Suburban Area</span>
                      <span className="font-semibold">12 issues</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Shopping District</span>
                      <span className="font-semibold">10 issues</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Park Zone</span>
                      <span className="font-semibold">8 issues</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Low Priority Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Residential North</span>
                      <span className="font-semibold">5 issues</span>
                    </li>
                    <li className="flex justify-between">
                      <span>University Campus</span>
                      <span className="font-semibold">4 issues</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Waterfront</span>
                      <span className="font-semibold">3 issues</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="register" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <RegistrationForm userType="authority" />
              <RegistrationForm userType="admin" />
            </div>
          </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}



function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="package h-full w-full">
      <div className="package2 h-full w-full !bg-[#1d1724]">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="p-2 bg-white/10 rounded-lg text-white">
            {icon}
          </div>
          <span className="text-xl sm:text-2xl font-bold text-white">{value}</span>
        </div>
        <div className="text-left w-full">
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">{title}</div>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={isPositive ? "text-green-500" : "text-red-500"}>{change}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartmentCard({
  department,
}: {
  department: {
    name: string;
    total: number;
    resolved: number;
    pending: number;
    avgTime: string;
  };
}) {
  const resolutionRate = ((department.resolved / department.total) * 100).toFixed(1);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">{department.name}</h4>
        <span className="text-sm text-gray-600">Avg: {department.avgTime}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
        <div>
          <p className="text-gray-600">Total</p>
          <p className="text-xl font-bold">{department.total}</p>
        </div>
        <div>
          <p className="text-gray-600">Resolved</p>
          <p className="text-xl font-bold text-green-600">{department.resolved}</p>
        </div>
        <div>
          <p className="text-gray-600">Pending</p>
          <p className="text-xl font-bold text-orange-600">{department.pending}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Resolution Rate</span>
          <span className="font-semibold">{resolutionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${resolutionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}