export type IssueStatus = "submitted" | "in_progress" | "resolved" | "rejected";
export type IssueCategory = "roads" | "water" | "garbage" | "sanitation" | "streetlights" | "other";

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
  reportedBy: string;
  reportedAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  department?: string;
  assignedTo?: string;
  resolutionNotes?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  priority: "low" | "medium" | "high";
}
