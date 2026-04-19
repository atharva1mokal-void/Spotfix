export type IssueStatus = "submitted" | "in_progress" | "info_requested" | "pending_verification" | "resolved" | "rejected";
export type IssueCategory = "roads" | "water" | "garbage" | "sanitation" | "streetlights" | "other";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  mobile?: string;
  userType: 'citizen' | 'authority' | 'admin';
  department?: string;
  karma: number;
}

export interface Issue {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reportedBy: string | User;
  reportedAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  department?: string;
  assignedTo?: string;
  assignedType?: string;
  resolutionNotes?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  infoRequestMessage?: string;
  infoProvidedMessage?: string;
  infoImageUrl?: string;
  adminVerificationNotes?: string;
  priority: "low" | "medium" | "high";
  reportCount?: number;
  upvotedBy?: string[];
}
