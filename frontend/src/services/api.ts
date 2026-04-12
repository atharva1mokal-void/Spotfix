import { Issue } from "../types";

const API_BASE_URL = "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "x-auth-token": token || "",
  };
};

export const api = {
  // Login
  login: async (credentials: { email: string; password: string; userType?: string }) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  // Register
  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Fetch all issues
  getIssues: async (): Promise<Issue[]> => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch issues");
    const data = await response.json();
    return data.map((issue: any) => ({
      ...issue,
      id: issue._id,
      reportedAt: new Date(issue.reportedAt),
      updatedAt: new Date(issue.updatedAt),
    }));
  },

  // Fetch a single issue
  getIssueById: async (id: string): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch issue");
    const issue = await response.json();
    return {
      ...issue,
      id: issue._id,
      reportedAt: new Date(issue.reportedAt),
      updatedAt: new Date(issue.updatedAt),
    };
  },

  // Report a new issue (handles FormData for file upload)
  reportIssue: async (formData: FormData): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: "POST",
      headers: getHeaders(), // Don't set Content-Type, browser will handle it for FormData
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to report issue");
    const savedIssue = await response.json();
    return {
      ...savedIssue,
      id: savedIssue._id,
    };
  },

  // Update an issue
  updateIssue: async (id: string, updateData: Partial<Issue>): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "PATCH",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error("Failed to update issue");
    const updatedIssue = await response.json();
    return {
      ...updatedIssue,
      id: updatedIssue._id,
    };
  },
};
