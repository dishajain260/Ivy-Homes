import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authStorage, startTokenRefreshTimer } from "./api/client";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ListingsPage from "./pages/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import RentalsPage from "./pages/RentalsPage";
import ProjectsPage from "./pages/ProjectsPage";
import SavedListingsPage from "./pages/SavedListingsPage";
import InsightsPage from "./pages/InsightsPage";

// Protected Layout Component
function ProtectedLayout({ children, onUserChange }) {
  const isAuth = authStorage.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onUserChange={onUserChange} />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Ivy Homes Technologies Pvt Ltd. Chennai Portfolios. Assignment Candidate: Disha Jain.</p>
      </footer>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(authStorage.getUser());

  useEffect(() => {
    // Start automatic token refresh timer
    if (authStorage.isAuthenticated()) {
      startTokenRefreshTimer();
    }

    const handleSessionExpired = () => {
      setCurrentUser(null);
      window.location.href = "/login";
    };

    window.addEventListener("ivy:session_expired", handleSessionExpired);
    return () => window.removeEventListener("ivy:session_expired", handleSessionExpired);
  }, []);

  const handleUserChange = () => {
    setCurrentUser(authStorage.getUser());
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleUserChange} />}
        />

        <Route
          path="/"
          element={
            <ProtectedLayout onUserChange={handleUserChange}>
              <ListingsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/listings/:id"
          element={
            <ProtectedLayout onUserChange={handleUserChange}>
              <ListingDetailPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/rentals"
          element={
            <ProtectedLayout onUserChange={handleUserChange}>
              <RentalsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedLayout onUserChange={handleUserChange}>
              <ProjectsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedLayout onUserChange={handleUserChange}>
              <SavedListingsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/insights"
          element={
            <ProtectedLayout onUserChange={handleUserChange}>
              <InsightsPage />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}