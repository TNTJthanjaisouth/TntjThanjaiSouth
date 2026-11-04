import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";
export default function PrivateRoute({children}:{children:ReactNode}) { const {isAuthenticated,loading}=useAuth(); if(loading)return <div className="min-h-screen grid place-items-center">ஏற்றப்படுகிறது...</div>; return isAuthenticated?children:<Navigate to="/" replace/>; }
