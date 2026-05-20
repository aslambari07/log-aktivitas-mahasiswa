import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../ui/Skeleton";

export function ProtectedRoute() {
  const { user, isReady } = useAuth();
  if (!isReady) return <Skeleton className="m-6 h-[300px]" />;
  if (!user) return <Navigate replace to="/login" />;
  return <Outlet />;
}
