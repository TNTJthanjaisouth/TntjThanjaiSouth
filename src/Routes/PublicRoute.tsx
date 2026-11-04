// src/routes/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute({ children }: any) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center">ஏற்றப்படுகிறது...</div>;

  // ✅ If already logged in → go to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}
