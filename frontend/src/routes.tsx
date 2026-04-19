import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/shared/LandingPage";
import { CitizenLogin } from "./pages/citizen/CitizenLogin";
import { AuthorityLogin } from "./pages/authority/AuthorityLogin";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { CitizenDashboard } from "./pages/citizen/CitizenDashboard";
import { AuthorityDashboard } from "./pages/authority/AuthorityDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ReportIssue } from "./pages/citizen/ReportIssue";
import { IssueDetails } from "./pages/shared/IssueDetails";
import { CitizenRegister } from "./pages/citizen/CitizenRegister";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login/citizen",
    Component: CitizenLogin,
  },
  {
    path: "/register/citizen",
    Component: CitizenRegister,
  },
  {
    path: "/login/authority",
    Component: AuthorityLogin,
  },
  {
    path: "/login/admin",
    Component: AdminLogin,
  },
  {
    path: "/citizen",
    element: (
      <ProtectedRoute allowedRoles={["citizen"]}>
        <CitizenDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/citizen/report",
    element: (
      <ProtectedRoute allowedRoles={["citizen"]}>
        <ReportIssue />
      </ProtectedRoute>
    ),
  },
  {
    path: "/issue/:id",
    element: (
      <ProtectedRoute allowedRoles={["citizen", "authority", "admin"]}>
        <IssueDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/authority",
    element: (
      <ProtectedRoute allowedRoles={["authority"]}>
        <AuthorityDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
