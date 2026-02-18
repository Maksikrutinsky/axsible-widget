import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SiteProvider } from "./context/SiteContext";
import { ToastProvider } from "./context/ToastContext";
import { Spinner } from "./components/ui/Spinner";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { PendingApprovalPage } from "./pages/PendingApprovalPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SettingsPage } from "./pages/SettingsPage";
import { EmbedPage } from "./pages/EmbedPage";
import { IssuesPage } from "./pages/IssuesPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminSitesPage } from "./pages/admin/AdminSitesPage";
import { AdminIssuesPage } from "./pages/admin/AdminIssuesPage";

function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner className="h-screen" />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RequireApproval() {
  const { user } = useAuth();
  if (!user?.is_approved) return <Navigate to="/pending" replace />;
  return <Outlet />;
}

function RequireAdmin() {
  const { user } = useAuth();
  if (!user?.is_admin) return <Navigate to="/" replace />;
  return <Outlet />;
}

function RedirectIfAuth() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner className="h-screen" />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <ToastProvider>
            <Routes>
              <Route element={<RedirectIfAuth />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route path="/pending" element={<PendingApprovalPage />} />

                <Route element={<RequireApproval />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/embed" element={<EmbedPage />} />
                    <Route path="/issues" element={<IssuesPage />} />

                    <Route element={<RequireAdmin />}>
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/admin/users" element={<AdminUsersPage />} />
                      <Route path="/admin/sites" element={<AdminSitesPage />} />
                      <Route path="/admin/issues" element={<AdminIssuesPage />} />
                    </Route>
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
