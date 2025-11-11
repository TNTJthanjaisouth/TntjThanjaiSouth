import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }: any) {
  const { isAuthenticated } = useAuth();

  // If your AuthContext doesn't expose a 'loading' flag, guard against undefined.
  // Remove this block if isAuthenticated is always a boolean.
  if (isAuthenticated === undefined || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children;
}
