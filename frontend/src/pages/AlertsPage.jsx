import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const GROUPS = [
  { type: "out",      icon: "🚫", label: "Out of Stock",  color: "#ef4444" },
  { type: "low",      icon: "⚠️", label: "Low Stock",     color: "#f59e0b" },
  { type: "expired",  icon: "💔", label: "Expired",       color: "#ef4444" },
  { type: "expiring", icon: "⏳", label: "Expiring Soon", color: "#8b5cf6" },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard")
      .then(({ data }) => setAlerts(data.data.alerts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>Loading…</div>;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f4c81", marginBottom: "1rem" }}>
        Alerts & Notifications
      </h2>

      {alerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✅</div>
          <div style={{ color: "#6b7280", fontWeight: 600 }}>All clear! No alerts right now.</div>
        </div>
      ) : (
        GROUPS.map(({ type, icon, label, color }) => {
          const group = alerts.filter(a => a.type === type);
          if (!group.length) return null;
          return (
            <div key={type} style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#374151", marginBottom: "0.5rem" }}>
                {icon} {label} <span style={{ background: color, color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: "0.7rem", marginLeft: 4 }}>{group.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {group.map((a, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "0.7rem 0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 1px 4px rgba(0,0,0,.06)", borderLeft: `3px solid ${color}` }}>
                    <span style={{ flex: 1, fontSize: "0.82rem", color: "#374151" }}>{a.message}</span>
                    <button
                      onClick={() => navigate("/medicines")}
                      style={{ background: "#1a73e8", color: "#fff", border: "none", borderRadius: 6, padding: "0.25rem 0.65rem", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}