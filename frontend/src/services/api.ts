import { Issue } from "../types";

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "x-auth-token": token || "",
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return response.json();
};

export const api = {
  // ── AUTH ──────────────────────────────────────────────

  login: async (credentials: { email: string; password: string; userType?: string }) => {
    const data = await handleResponse(await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }));
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  register: async (userData: {
    name: string; email: string; mobile?: string; password: string; userType?: string;
  }) => {
    const data = await handleResponse(await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userData, userType: "citizen" }),
    }));
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getMe: async () => {
    return handleResponse(await fetch(`${API_BASE_URL}/me`, {
      headers: getHeaders(),
    }));
  },

  // Admin: provision a new authority/admin account
  provisionUser: async (userData: {
    name: string; email: string; password: string;
    userType: "authority" | "admin"; department?: string;
  }) => {
    return handleResponse(await fetch(`${API_BASE_URL}/provision`, {
      method: "POST",
      headers: { ...getHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }));
  },

  // Admin: get all users
  getAllUsers: async () => {
    return handleResponse(await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders(),
    }));
  },

  // Admin: toggle ban on a user
  toggleBanUser: async (userId: string) => {
    return handleResponse(await fetch(`${API_BASE_URL}/users/${userId}/ban`, {
      method: "PATCH",
      headers: getHeaders(),
    }));
  },

  // ── ISSUES ────────────────────────────────────────────

  normalizeIssue: (issue: any): Issue => ({
    ...issue,
    id: issue._id,
    reportedBy: issue.reportedBy,
    reportedAt: new Date(issue.createdAt || issue.reportedAt),
    updatedAt: new Date(issue.updatedAt),
    upvotedBy: issue.upvotedBy || [],
  }),

  // Admin: all issues
  getIssues: async (): Promise<Issue[]> => {
    const data = await handleResponse(await fetch(`${API_BASE_URL}/issues`, {
      headers: getHeaders(),
    }));
    return data.map(api.normalizeIssue);
  },

  // Citizen: own issues only
  getMyIssues: async (): Promise<Issue[]> => {
    const data = await handleResponse(await fetch(`${API_BASE_URL}/issues/my`, {
      headers: getHeaders(),
    }));
    return data.map(api.normalizeIssue);
  },

  // Citizen: community issues (public issues in area)
  getCommunityIssues: async (): Promise<Issue[]> => {
    const data = await handleResponse(await fetch(`${API_BASE_URL}/issues/community`, {
      headers: getHeaders(),
    }));
    return data.map(api.normalizeIssue);
  },

  // Authority: department-filtered issues
  getDepartmentIssues: async (): Promise<Issue[]> => {
    const data = await handleResponse(await fetch(`${API_BASE_URL}/issues/department`, {
      headers: getHeaders(),
    }));
    return data.map(api.normalizeIssue);
  },

  // Admin: live analytics
  getAnalytics: async () => {
    return handleResponse(await fetch(`${API_BASE_URL}/issues/analytics`, {
      headers: getHeaders(),
    }));
  },

  // Single issue
  getIssueById: async (id: string): Promise<Issue> => {
    const issue = await handleResponse(await fetch(`${API_BASE_URL}/issues/${id}`, {
      headers: getHeaders(),
    }));
    return api.normalizeIssue(issue);
  },

  // Report new issue (FormData with optional image)
  reportIssue: async (formData: FormData): Promise<Issue> => {
    const savedIssue = await handleResponse(await fetch(`${API_BASE_URL}/issues`, {
      method: "POST",
      headers: getHeaders(),
      body: formData,
    }));
    return api.normalizeIssue(savedIssue);
  },

  // AI Prediction: detect category from image
  predictCategory: async (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return handleResponse(await fetch(`${API_BASE_URL}/issues/predict-category`, {
      method: "POST",
      headers: getHeaders(),
      body: formData,
    }));
  },

  // Update issue status / notes (with optional afterImage)
  updateIssue: async (id: string, updateData: Partial<Issue> | FormData): Promise<Issue> => {
    const isFormData = updateData instanceof FormData;
    const updatedIssue = await handleResponse(await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "PATCH",
      headers: isFormData ? getHeaders() : { ...getHeaders(), "Content-Type": "application/json" },
      body: isFormData ? updateData : JSON.stringify(updateData),
    }));
    return api.normalizeIssue(updatedIssue);
  },

  // Admin: reassign issue to a different department
  reassignIssue: async (id: string, department: string): Promise<Issue> => {
    const updatedIssue = await handleResponse(await fetch(`${API_BASE_URL}/issues/${id}/assign`, {
      method: "PATCH",
      headers: { ...getHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ department }),
    }));
    return api.normalizeIssue(updatedIssue);
  },

  // Delete an issue
  deleteIssue: async (id: string): Promise<void> => {
    await handleResponse(await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }));
  },

  // Clear a user's issues (or clear all issues for admin/testing)
  clearHistory: async (): Promise<void> => {
    await handleResponse(await fetch(`${API_BASE_URL}/issues/clear`, {
      method: "DELETE",
      headers: getHeaders(),
    }));
  },

  // Upvote / Support an issue
  upvoteIssue: async (id: string): Promise<Issue> => {
    const updatedIssue = await handleResponse(await fetch(`${API_BASE_URL}/issues/${id}/upvote`, {
      method: "PATCH",
      headers: getHeaders(),
    }));
    return api.normalizeIssue(updatedIssue);
  },

  // Get leaderboard
  getLeaderboard: async () => {
    return handleResponse(await fetch(`${API_BASE_URL}/users/leaderboard`, {
      headers: getHeaders(),
    }));
  },

  // Get user profile
  getUserProfile: async () => {
    return handleResponse(await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getHeaders(),
    }));
  },
};
