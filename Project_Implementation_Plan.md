# Smart Civic Issue Reporting: Comprehensive Project Plan

## Overview
The "Smart Civic Issue Reporting" platform is a unified system designed to bridge the gap between citizens and municipal authorities. It empowers users to digitally report local civic issues (potholes, garbage, broken streetlights) via geolocation and photo uploads, while providing granular tracking and administrative tools for the correct departments to efficiently address and resolve these issues.

---

## 1. Role-Based Capabilities & Workflows

The platform restricts capabilities securely via three primary persona roles using JWT-based authentication.

### 👤 Citizen (End Users)
The primary generators of civic issue data.
- **Authentication:** Registration & Login (`CitizenRegister`, `CitizenLogin`).
- **Create Reports (`ReportIssue`):** Submit localized issues. Capture data includes interactive map picking (Lat/Lng), issue categorization, rich descriptions, and a mandatory "Before" Image upload.
- **Tracking (`CitizenDashboard`):** View a personal feed of all submitted issues.
- **Issue Interaction (`IssueDetails`):** Track real-time status changes (`submitted`, `in_progress`, `resolved`, `rejected`) and read `resolutionNotes` provided by authorities.

### 🏢 Authority (Department Workflow)
The specific municipal department (e.g., Water Board, Sanitation Dept) responsible for fixing issues.
- **Authentication:** Dedicated secure login (`AuthorityLogin`). Cannot register themselves; accounts are provisioned via Admin.
- **Department Queue (`AuthorityDashboard`):** Authorities only see issues intelligently routed and assigned to their specific department.
- **Issue Processing:**
  - Mark status as `in_progress`.
  - Upon completion, mark as `resolved` and provide official `resolutionNotes`.
  - **Accountability:** Upload an `afterImageUrl` serving as photographic proof of resolution.

### 👑 Admin (System Supervisors)
High-level supervisors who monitor the platform's overarching health and departmental performance.
- **Authentication:** Dedicated extreme-security login (`AdminLogin`).
- **Global Dashboard (`AdminDashboard`):** 
  - Access to every issue in the system across all departments.
  - Ability to forcefully assign or re-assign issues to different departments.
  - **Analytics:** Data visualization (via Recharts) displaying resolution rates, average turnaround times, and categorizing systemic failure points.
- **Entity Management:** Provision Authority accounts or ban malicious Citizens.

---

## 2. Core Technical Architecture & Data Models

### Frontend (Vite + React + Tailwind + Shadcn UI)
- **Routing:** Centralized React Router to navigate between disparate dashboards and isolated login spaces.
- **Interactive Mapping:** Integration with Maps API (e.g. Leaflet or Google Maps) to geolocate issues effectively.
- **State Management & Data Fetching:** Dynamic API consumption routed strictly through the Vite proxy (to `/api`) avoiding CORS bloat.

### Backend (Node + Express + MongoDB)
- **Data Models:** 
  - **User Schema:** Manages distinct `.userType` discriminants (`citizen`, `authority`, `admin`) to restrict API endpoint access.
  - **Issue Schema:** Enforces tight category enumerations (`roads`, `water`, `garbage`, etc.) and enforces payload schemas for `location` arrays and photo handling.
- **Media Management:** Local `multer` storage routing through `uploads/` for fast prototyping (migratable to AWS S3 in production).

---

## 3. Future Engineering Roadmap (Proposed Feature Enhancements)

While the base platform establishes a fantastic MVP, here are the major additions we will implement structurally to make it a globally competitive piece of software:

### Phase 1: Real-time Communication
- **Socket.io Integration:** Implement WebSockets so when an Authority changes a status to `resolved`, the Citizen's dashboard updates dynamically without a refresh.
- **In-App Notifications:** A bell-icon system within dashboards.

### Phase 2: AI & Automated Triage
- **Duplicate Detection System:** When a Citizen attempts to report an issue, the system geometrically cross-references existing unresolved issues within a 50-meter radius to prevent duplicate spamming.
- **Automated Routing:** Machine Learning models parsing the Issue Description to automatically guess and assign the priority (`low`, `medium`, `high`) and correct `department`.

### Phase 3: Infinite Scale & Production Infrastructure
- **Pagination & Cursors:** Dashboards currently fetch *all* issues. We will implement infinite scroll and paginated backend queries so dashboards load instantly even at 100,000+ issues.
- **Object Storage Migration:** Shift `multer` local storage to AWS S3 / Cloudflare R2 links to distribute the multimedia load onto CDNs.

## Open Questions for You

> [!IMPORTANT]
> - Do you want to implement features from the "Future Engineering Roadmap" right now (e.g., Pagination, Socket.io)? 
> - Are there any exact UI/UX features or distinct design languages you want to prioritize across the dashboards next?
> - Let me know which features you want to focus on developing first!

---

## 4. Master Feature Checklist

### ✔️ Currently Implemented Features
- [x] **Role-Based Access Control:** Distinct authentication and view isolation for Citizens, Authorities, and Admins via JWT.
- [x] **Issue Submission Engine:** Forms with category selection, descriptions, and "before" photo uploads.
- [x] **Geolocation Tracking:** Accurately logging latitude and longitude for each report.
- [x] **Customized Dashboards:** Sub-divided issue feeds based on the user's role (Personal vs Department-specific vs Global).
- [x] **Lifecycle Status Workflow:** Moving statuses logically from `submitted` $\rightarrow$ `in_progress` $\rightarrow$ `resolved`.
- [x] **Proof of Resolution:** Authorities must attach backend resolution notes and an "after" image.

### 🚀 Upcoming Features To Be Built
- [ ] **Interactive Map Interfaces:** Dropping live issue markers on an interactive Leaflet/Google Map.
- [ ] **Real-Time Status Notifications:** Integrating `Socket.io` to alert Citizens instantly when their issue gets updated.
- [ ] **Duplicate Prevention Geofencing:** System algorithm that blocks redundant issue creation within a tiny radius.
- [ ] **Admin Analytics Dashboards:** Bringing the `Recharts` data to life to show Department success/failure rates and resolution turnaround times.
- [ ] **AI-Assisted Issue Triage:** NLP models parsing citizen text to automatically infer the `priority` level and assign it the right `department`.
- [ ] **Performance Pagination:** Implementing infinite-scrolling queries to handle large civic datasets without freezing the browser.
- [ ] **Cloud Storage Migration:** Shifting image attachments to scalable cloud buckets like AWS S3 to future-proof the backend.
