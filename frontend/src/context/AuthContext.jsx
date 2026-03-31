import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dawa_user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("dawa_token");
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("dawa_user", JSON.stringify(data.user));
      } catch {
        localStorage.removeItem("dawa_token");
        localStorage.removeItem("dawa_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("dawa_token", data.token);
    localStorage.setItem("dawa_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dawa_token");
    localStorage.removeItem("dawa_user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};