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
    Component: CitizenDashboard,
  },
  {
    path: "/citizen/report",
    Component: ReportIssue,
  },
  {
    path: "/issue/:id",
    Component: IssueDetails,
  },
  {
    path: "/authority",
    Component: AuthorityDashboard,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
