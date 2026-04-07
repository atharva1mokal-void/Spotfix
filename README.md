# 🛡️ SpotFix: Smart Civic Issue Reporting System

SpotFix is a modern, full-stack platform designed to bridge the gap between citizens and municipal authorities. It empowers users to report local civic issues (potholes, garbage, broken streetlights) with photographic evidence and geolocation, while providing robust management tools for authorities to resolve them efficiently.

---

## ✨ Key Features

### 👤 Citizen Portal
- **Real-time Reporting**: Submit issues with photos, descriptions, and location data.
- **Personal Dashboard**: Track the lifecycle of your reported issues.
- **Interactive Tracking**: Receive updates from authorities directly on your dashboard.

### 🏢 Authority Portal
- **Department Queue**: View and manage issues specific to your department (Water, Roads, etc.).
- **Workflow Management**: Update issue status from `Submitted` to `In Progress` and `Resolved`.
- **Proof of Resolution**: Mandatory resolution notes and "After" photo uploads for accountability.

### 👑 Admin Dashboard
- **System-wide Analytics**: High-level overview of city performance using Recharts.
- **Staff Management**: Provision and manage Authority and Admin accounts.
- **Global Heatmap**: Identify civic hotspots and systemic failure points across the city.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & Lucide Icons
- **Components**: Radix UI (Headless components)
- **State/Routing**: React Router v7
- **Charts**: Recharts (Data Visualization)
- **Feedback**: Sonner (Toasts) & Framer Motion (Animations)

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT & Bcryptjs
- **Media**: Multer (Local file handling)
- **Configuration**: Dotenv

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Smart Civic Issue Reporting"
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

4. **Seed the database** (Optional but recommended for testing)
   ```bash
   cd backend
   node seed.js
   ```

### Running Locally

From the root directory, run:
```bash
npm run dev
```
This will start both the frontend (`localhost:5173`) and the backend (`localhost:5000`) simultaneously.

---

## 📁 Project Structure

```text
├── backend/            # Express API & MongoDB Models
│   ├── src/
│   │   ├── controllers/ # Logic handlers
│   │   ├── models/      # Data schemas
│   │   └── routes/      # API endpoints
│   └── uploads/        # Stored images
├── frontend/           # Vite + React Client
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Dashboards & Forms
│   │   └── services/    # API integration
└── package.json        # Root scripts
```

---

## 📜 License
This project is licensed under the ISC License.
