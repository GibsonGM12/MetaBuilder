import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { DashboardDesignerList } from "./pages/DashboardDesignerList";
import { DashboardDesignerPage } from "./pages/DashboardDesignerPage";
import { DashboardList } from "./pages/DashboardList";
import { DashboardView } from "./pages/DashboardView";
import { EntityDetail } from "./pages/EntityDetail";
import { EntityManagement } from "./pages/EntityManagement";
import { EntityRecords } from "./pages/EntityRecords";
import { FormDesignerList } from "./pages/FormDesignerList";
import { FormDesignerPage } from "./pages/FormDesignerPage";
import { FormFill } from "./pages/FormFill";
import { FormList } from "./pages/FormList";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboards"
        element={
          <ProtectedRoute>
            <DashboardList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboards/:id"
        element={
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboards"
        element={
          <ProtectedRoute>
            <DashboardDesignerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboards/new"
        element={
          <ProtectedRoute>
            <DashboardDesignerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboards/:id/edit"
        element={
          <ProtectedRoute>
            <DashboardDesignerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <FormList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms/:id"
        element={
          <ProtectedRoute>
            <FormFill />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/forms"
        element={
          <ProtectedRoute>
            <FormDesignerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/forms/new"
        element={
          <ProtectedRoute>
            <FormDesignerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/forms/:id/edit"
        element={
          <ProtectedRoute>
            <FormDesignerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <EntityRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entities"
        element={
          <ProtectedRoute>
            <EntityManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entities/:id"
        element={
          <ProtectedRoute>
            <EntityDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
