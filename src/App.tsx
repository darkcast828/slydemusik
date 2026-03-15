/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Player from "./pages/Player";
import Analytics from "./pages/Analytics";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import Payment from "./pages/Payment";
import AIAssistant from "./pages/AIAssistant";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Carregando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function PaidRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, userProfile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Carregando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (userProfile && !userProfile.hasPaid && userProfile.role !== 'admin') {
    return <Navigate to="/payment" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/slyde-secret-control" element={<AdminPanel />} />
            <Route path="/payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <PaidRoute>
                <DashboardLayout />
              </PaidRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="upload" element={<Upload />} />
              <Route path="player" element={<Player />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="assistant" element={<AIAssistant />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
