import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import PublicRoute from "./Routes/PublicRoute";
import PrivateRoute from "./Routes/ProtectedRoute";

import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { Preview } from "./components/Preview";
import { Toaster } from "sonner";
import ManageDataPage from "./Pages/ManageDataPage";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster closeButton />
        <BrowserRouter>
          <Routes>
            {/* Public route → Login page */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LoginPage
                    onLoginSuccess={() => {
                      window.location.href = "/dashboard";
                    }}
                  />
                </PublicRoute>
              }
            />

            {/* Private route → Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/manageData"
              element={
                <PrivateRoute>
                  <ManageDataPage />
                </PrivateRoute>
              }
            />

            {/* Private route → Preview page */}
            <Route
              path="/preview"
              element={
                <PrivateRoute>
                  <Preview />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
