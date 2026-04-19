import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = "/" }: ProtectedRouteProps) {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // Not logged in at all
  if (!token || !userStr) {
    return <Navigate to={redirectTo} replace />;
  }

  let user: any;
  try {
    user = JSON.parse(userStr);
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to={redirectTo} replace />;
  }

  // Logged in but wrong role
  if (!allowedRoles.includes(user.userType)) {
    // Redirect to their own dashboard
    if (user.userType === "citizen") return <Navigate to="/citizen" replace />;
    if (user.userType === "authority") return <Navigate to="/authority" replace />;
    if (user.userType === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
