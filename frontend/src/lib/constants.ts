export const categoryConfig = {
  roads: {
    label: "Roads & Potholes",
    description: "Damaged roads, potholes, broken footpaths, waterlogging",
    department: "Public Works (PWD)",
    color: "#ef4444",
    icon: "Construction",
    emoji: "🛣️",
  },
  water: {
    label: "Water Supply",
    description: "Pipe leaks, water shortage, contamination, burst mains",
    department: "Water Supply (CIDCO)",
    color: "#3b82f6",
    icon: "Droplet",
    emoji: "💧",
  },
  garbage: {
    label: "Garbage & Waste",
    description: "Overflowing bins, uncollected waste, illegal dumping",
    department: "Sanitation Department",
    color: "#22c55e",
    icon: "Trash2",
    emoji: "🗑️",
  },
  sanitation: {
    label: "Drainage & Sewage",
    description: "Open manholes, blocked drains, sewage overflow, bad odour",
    department: "Sanitation Department",
    color: "#a855f7",
    icon: "Recycle",
    emoji: "🚰",
  },
  streetlights: {
    label: "Street Lights",
    description: "Broken or non-functional street lights, electrical hazards",
    department: "Electrical Department",
    color: "#f59e0b",
    icon: "Lightbulb",
    emoji: "💡",
  },
  other: {
    label: "Other Issues",
    description: "Encroachments, noise pollution, stray animals, park maintenance",
    department: "General Administration",
    color: "#6b7280",
    icon: "AlertCircle",
    emoji: "📋",
  },
};

export const statusConfig = {
  submitted: { label: "Submitted", color: "#A69288" },
  in_progress: { label: "In Progress", color: "#FF9933" },
  info_requested: { label: "Info Requested", color: "#FFA500" },
  pending_verification: { label: "Pending Verification", color: "#1E90FF" },
  resolved: { label: "Resolved", color: "#138808" },
  rejected: { label: "Rejected", color: "#800000" },
  saffron: "#FF9933",
  turmeric: "#FFA500",
  accent: "#D2691E",
  green: "#138808",
  navy: "#000080",
};

// Kept for legacy compatibility — no longer used as primary data source
export const departmentStats = [
  { name: "Public Works (PWD)", total: 0, resolved: 0, pending: 0, avgTime: "—" },
  { name: "Water Supply (CIDCO)", total: 0, resolved: 0, pending: 0, avgTime: "—" },
  { name: "Sanitation Department", total: 0, resolved: 0, pending: 0, avgTime: "—" },
  { name: "Electrical Department", total: 0, resolved: 0, pending: 0, avgTime: "—" },
  { name: "General Administration", total: 0, resolved: 0, pending: 0, avgTime: "—" },
];

export const monthlyData: { month: string; submitted: number; resolved: number }[] = [];

export const categoryDistribution: { category: string; count: number; percentage: number }[] = [];
