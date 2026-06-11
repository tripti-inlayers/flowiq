// frontend/src/context/AuthContext.jsx
// -------------------------------------------------------
// Wraps the entire app. Provides useAuth() hook to any component.
// Persists JWT in localStorage and rehydrates on refresh.
// -------------------------------------------------------

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem("flowiq_token"));
  const [loading, setLoading] = useState(true);  // true until rehydration finishes

  // ── Rehydrate on mount ─────────────────────────────────
  useEffect(() => {
    if (!token) { setLoading(false); return; }

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(u => setUser(u))
      .catch(() => {
        // Token invalid / expired — clear it
        localStorage.removeItem("flowiq_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // ── Login ─────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Login failed");
    }

    const data = await res.json();
    localStorage.setItem("flowiq_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;   // caller uses role for redirect
  }, []);

  // ── Register ──────────────────────────────────────────
  const register = useCallback(async (payload) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Registration failed");
    }

    const data = await res.json();
    localStorage.setItem("flowiq_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  }, []);

  // ── Logout ────────────────────────────────────────────
  const logout = useCallback(async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});   // fire-and-forget; we clear locally regardless
    localStorage.removeItem("flowiq_token");
    setToken(null);
    setUser(null);
  }, [token]);

  // ── Convenience: attach token to any fetch ─────────────
  const authFetch = useCallback((url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
