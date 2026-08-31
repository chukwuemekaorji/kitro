import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireAuth({ children }: { children: ReactElement }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
}
