import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "expenzo_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const syncProfile = async () => {
      if (!token) return;
      try {
        const res = await api.get("/users/profile");
        const freshUser = res.data?.user;
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ user: freshUser, token })
          );
        }
      } catch {
        // ignore, will fall back to stored info
      }
    };
    syncProfile();
  }, [token]);

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: data.user, token: data.token })
    );
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    navigate("/login");
  };

  const refreshUser = async () => {
    if (!token) return null;
    const res = await api.get("/users/profile");
    const freshUser = res.data?.user;
    if (freshUser) {
      setUser(freshUser);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: freshUser, token })
      );
    }
    return freshUser;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
      loading,
      refreshUser,
      setUser, // expose for advanced flows like avatar preview
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

