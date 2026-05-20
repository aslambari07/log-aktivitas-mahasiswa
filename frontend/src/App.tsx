import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Skeleton } from "./components/ui/Skeleton";

const AppShell = lazy(() => import("./components/layout/AppShell").then((module) => ({ default: module.AppShell })));
const ActivitiesPage = lazy(() => import("./pages/ActivitiesPage").then((module) => ({ default: module.ActivitiesPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));

export default function App() {
  return (
    <Suspense fallback={<Skeleton className="m-6 h-[320px]" />}>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route element={<DashboardPage />} index />
            <Route element={<ActivitiesPage />} path="/aktivitas" />
          </Route>
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
  );
}
