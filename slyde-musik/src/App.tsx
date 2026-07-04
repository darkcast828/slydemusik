/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Player from "./pages/Player";
import Analytics from "./pages/Analytics";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import AIAssistant from "./pages/AIAssistant";
import { AIChatSupport } from "./components/AIChatSupport";
import { PurchaseNotification } from "./components/PurchaseNotification";
import SongsPage from "./pages/SongsPage";
import RecentPage from "./pages/RecentPage";
import LocalPage from "./pages/LocalPage";
import AlbumsPage from "./pages/AlbumsPage";
import StarredPage from "./pages/StarredPage";
import DiscoverPage from "./pages/DiscoverPage";
import FavoritesPage from "./pages/FavoritesPage";
import TrendingPage from "./pages/TrendingPage";
import DownloadsPage from "./pages/DownloadsPage";
import LibraryPage from "./pages/LibraryPage";
import RadioPage from "./pages/RadioPage";
import StorePage from "./pages/StorePage";

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
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Carregando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Home />} />
            <Route path="/admin/slyde-secret-control" element={<AdminPanel />} />
            <Route path="/dashboard" element={
              <PaidRoute>
                <DashboardLayout />
              </PaidRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="upload" element={<Upload />} />
              <Route path="songs" element={<SongsPage />} />
              <Route path="recent" element={<RecentPage />} />
              <Route path="local" element={<LocalPage />} />
              <Route path="albums" element={<AlbumsPage />} />
              <Route path="artists" element={<Profile />} />
              <Route path="starred" element={<StarredPage />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="trending" element={<TrendingPage />} />
              <Route path="downloads" element={<DownloadsPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="radio" element={<RadioPage />} />
              <Route path="store" element={<StorePage />} />
              <Route path="player" element={<Player />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="assistant" element={<AIAssistant />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <AIChatSupport />
          <PurchaseNotification />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
