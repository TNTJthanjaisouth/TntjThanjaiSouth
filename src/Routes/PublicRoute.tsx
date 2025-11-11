// src/routes/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute({ children }: any) {
  const { isAuthenticated } = useAuth();

  // ✅ If already logged in → go to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}
