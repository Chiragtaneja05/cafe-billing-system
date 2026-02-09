import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import BillingPage from "./pages/BillingPage";
import MenuPage from "./pages/MenuPage";
import BillsPage from "./pages/BillsPage";
import Settings from "./pages/Settings"; // ✅ Import Settings Page
import ProtectedRoute from "./components/ProtectedRoute";
import PublicMenu from "./pages/PublicMenu"; // Top of file
import ExpensesPage from "./pages/ExpensesPage";

// ... inside <Routes>

import "./App.css"; // ✅ Ensure CSS is imported for responsive design

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />

        <Route path="/menu/public/:ownerId" element={<PublicMenu />} />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <BillsPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ New Route for Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
