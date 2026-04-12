# Walkthrough: Smart Civic Issue Reporting System

Welcome to the **SpotFix** platform! This guide will take you through the end-to-end workflows for all three major user roles.

---

## 🚀 Quick Start: Testing Credentials

We have seeded the database with default accounts so you can explore the platform immediately.

| Role | Email / ID | Password | Portal |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@spotfix.gov` | `admin123` | [Admin Login](http://localhost:5173/login/admin) |
| **Authority** | `authority@spotfix.gov` | `authority123` | [Authority Login](http://localhost:5173/login/authority) |
| **Citizen** | `citizen@spotfix.gov` | `citizen123` | [Citizen Login](http://localhost:5173/login/citizen) |

> [!TIP]
> Use the [Landing Page](http://localhost:5173/) to navigate between the different login portals easily.

---

## 👤 1. The Citizen Journey

As a citizen, your primary goal is to report issues and track their resolution.

### Steps:
1.  **Report an Issue**: Navigate to the "Report Issue" page. You can upload a photo of the problem (e.g., a pothole), select a category, and describe the issue.
2.  **Geolocation**: The system automatically captures your coordinates (if permitted) or allows you to pick a location on the map.
3.  **Track Status**: Your dashboard shows a real-time feed of all your reports. You can see when an authority marks it as "In Progress" or "Resolved".

````carousel
![Citizen Dashboard](file:///c:/Users/Aditya/Desktop/Smart%20Civic%20Issue%20Reporting/media/citizen_dashboard.png)
<!-- slide -->
```typescript
// Fragment from CitizenDashboard.tsx
const stats = {
  total: issues.length,
  submitted: issues.filter(i => i.status === "submitted").length,
  inProgress: issues.filter(i => i.status === "in_progress").length,
  resolved: issues.filter(i => i.status === "resolved").length,
};
```
````

---

## 🏢 2. The Authority Workflow

Authorities are department-specific officers responsible for physical fixes.

### Steps:
1.  **Manage Queue**: Log in to see issues filtered specifically for your department (e.g., Transport for roads, Sanitation for garbage).
2.  **Update Progress**: When you start working on an issue, change its status to **In Progress**. This notifies the citizen that action is being taken.
3.  **Final Resolution**: Once fixed, mark the issue as **Resolved**. You must provide resolution notes and upload an "After" photo as proof of work.

![Authority Portal](file:///c:/Users/Aditya/Desktop/Smart%20Civic%20Issue%20Reporting/media/authority_portal.png)

---

## 👑 3. The Admin Oversight

Administrators have a "birds-eye view" of the entire city's civic health.

### Steps:
1.  **Global Analytics**: View trends over time—how many issues are being reported vs. resolved? Which departments are underperforming?
2.  **Heatmap Analysis**: Use the city-wide heatmap to identify geographical corridors with frequent civic failures.
3.  **Staffing**: Admins can register new **Authority** accounts for specific departments and even add additional **Admins**.

![Admin Analytics](file:///c:/Users/Aditya/Desktop/Smart%20Civic%20Issue%20Reporting/media/admin_analytics.png)

---

## 🔄 Issue Lifecycle

The lifecycle follows a strict sequence to ensure accountability:
1.  **Submitted**: Issue is logged by a Citizen.
2.  **In Progress**: Authority acknowledges and starts work.
3.  **Resolved**: Fix is confirmed with an "After" photo.
4.  **Rejected**: Admin/Authority determines the report is invalid or duplicate.

> [!IMPORTANT]
> All status changes are secured by JWT authentication—only the assigned authority or a system admin can modify the lifecycle of a specific ticket.

---

## 🛠️ Verification Success

We have verified the system's core stability:
1.  **Seeding**: Database populated using `backend/seed.js`.
2.  **Connectivity**: Frontend connects to Backend via Vite proxy on port 5000.
3.  **Media**: Multer successfully handles image uploads to the `backend/uploads` directory.
