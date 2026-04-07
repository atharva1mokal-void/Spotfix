export const categoryConfig = {
  roads: { label: "Roads & Infrastructure", color: "#ef4444", icon: "Construction" },
  water: { label: "Water Supply", color: "#3b82f6", icon: "Droplet" },
  garbage: { label: "Garbage Collection", color: "#22c55e", icon: "Trash2" },
  sanitation: { label: "Sanitation", color: "#a855f7", icon: "Recycle" },
  streetlights: { label: "Street Lights", color: "#f59e0b", icon: "Lightbulb" },
  other: { label: "Other Issues", color: "#6b7280", icon: "AlertCircle" },
};

export const statusConfig = {
  submitted: { label: "Submitted", color: "#6b7280" },
  in_progress: { label: "In Progress", color: "#f59e0b" },
  resolved: { label: "Resolved", color: "#22c55e" },
  rejected: { label: "Rejected", color: "#ef4444" },
};

export const departmentStats = [
  { name: "Public Works (PMC)", total: 45, resolved: 32, pending: 13, avgTime: "2.5 days" },
  { name: "Water Supply (CIDCO)", total: 28, resolved: 22, pending: 6, avgTime: "1.8 days" },
  { name: "Sanitation Department", total: 56, resolved: 48, pending: 8, avgTime: "1.2 days" },
  { name: "Electrical Dept", total: 34, resolved: 25, pending: 9, avgTime: "3.1 days" },
];

export const monthlyData = [
  { month: "Sep", submitted: 110, resolved: 90 },
  { month: "Oct", submitted: 130, resolved: 110 },
  { month: "Nov", submitted: 120, resolved: 105 },
  { month: "Dec", submitted: 90, resolved: 85 },
  { month: "Jan", submitted: 140, resolved: 120 },
  { month: "Feb", submitted: 150, resolved: 130 },
  { month: "Mar", submitted: 65, resolved: 45 },
];

export const categoryDistribution = [
  { category: "Roads", count: 40, percentage: 25 },
  { category: "Water", count: 35, percentage: 22 },
  { category: "Garbage", count: 50, percentage: 31 },
  { category: "Streetlights", count: 25, percentage: 16 },
  { category: "Other", count: 10, percentage: 6 },
];
