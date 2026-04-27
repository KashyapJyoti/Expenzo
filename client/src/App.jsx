import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Auth/LoginPage.jsx";
import { RegisterPage } from "./pages/Auth/RegisterPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { TransactionsPage } from "./pages/TransactionsPage.jsx";
import { ChartsPage } from "./pages/ChartsPage.jsx";
import { TipsPage } from "./pages/TipsPage.jsx";
import { ProtectedRoute } from "./components/ui/ProtectedRoute.jsx";
import { ProfilePage } from "./pages/Profile.jsx";

const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

