import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await api.get("/dashboard");
        setAlertCount(data.data.alerts.length);
      } catch {}
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: "🏠", exact: true },
    { to: "/medicines", label: "Medicines", icon: "💊" },
    { to: "/suppliers", label: "Suppliers", icon: "🏭" },
    { to: "/alerts", label: "Alerts", icon: "🔔", badge: alertCount },
    ...(isAdmin ? [{ to: "/users", label: "Users", icon: "👥" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", paddingBottom: 72 }}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>
            <span style={{ fontSize: "1.8rem" }}>⚕</span>
            <div>
              <div style={s.logoText}>Dawa</div>
              <div style={s.logoSub}>दवा इन्वेंटरी</div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <button style={s.avatarBtn} onClick={() => setShowProfile(p => !p)}>
              <span style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</span>
              <span style={s.userName}>{user?.name}</span>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>▾</span>
            </button>
            {showProfile && (
              <div style={s.dropdown}>
                <div style={s.dropdownInfo}>
                  <div style={{ fontWeight: 700 }}>{user?.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{user?.email}</div>
                  <span style={{ ...s.roleBadge, background: user?.role === "admin" ? "#dbeafe" : "#d1fae5", color: user?.role === "admin" ? "#1e40af" : "#065f46" }}>
                    {user?.role}
                  </span>
                </div>
                <button style={s.dropdownBtn} onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ padding: "1rem 0.85rem 0.5rem" }}>
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav style={s.nav}>
        {navItems.map(({ to, label, icon, badge, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            style={({ isActive }) => ({ ...s.navBtn, color: isActive ? "#1a73e8" : "#9ca3af" })}
          >
            <span style={{ fontSize: "1.2rem", position: "relative" }}>
              {icon}
              {badge > 0 && (
                <span style={s.navBadge}>{badge}</span>
              )}
            </span>
            <span style={s.navLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const s = {
  header: { background: "linear-gradient(135deg,#0f4c81 0%,#1a73e8 100%)", boxShadow: "0 2px 12px rgba(0,0,0,.18)" },
  headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem" },
  logo: { display: "flex", alignItems: "center", gap: "0.6rem" },
  logoText: { color: "#fff", fontWeight: 800, fontSize: "1.1rem" },
  logoSub: { color: "rgba(255,255,255,0.7)", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase" },
  avatarBtn: { background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: "0.35rem 0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" },
  avatar: { width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.3)", color: "#fff", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center" },
  userName: { color: "#fff", fontWeight: 600, fontSize: "0.82rem" },
  dropdown: { position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", minWidth: 200, zIndex: 200, overflow: "hidden" },
  dropdownInfo: { padding: "0.9rem 1rem", borderBottom: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 4 },
  roleBadge: { display: "inline-block", borderRadius: 20, padding: "2px 10px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", marginTop: 4, width: "fit-content" },
  dropdownBtn: { width: "100%", border: "none", background: "none", padding: "0.75rem 1rem", textAlign: "left", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "#ef4444" },
  nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", display: "flex", borderTop: "1px solid #e5e7eb", zIndex: 100, boxShadow: "0 -2px 10px rgba(0,0,0,.08)" },
  navBtn: { flex: 1, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "0.5rem 0.2rem" },
  navLabel: { fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" },
  navBadge: { position: "absolute", top: -4, right: -6, background: "#ef4444", color: "#fff", borderRadius: "50%", fontSize: "0.5rem", width: 13, height: 13, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
};