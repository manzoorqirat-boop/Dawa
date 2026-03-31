import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { StockBadge, ExpiryBadge, CategoryBadge } from "../components/Badges";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dash, meds] = await Promise.all([
          api.get("/dashboard"),
          api.get("/medicines?limit=5"),
        ]);
        setData(dash.data.data);
        setMedicines(meds.data.data);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <Spinner />;

  const { stats, alerts } = data;
  const statCards = [
    { label: "Total Medicines", value: stats.totalMedicines, icon: "💊", color: "#3b82f6" },
    { label: "Low Stock", value: stats.lowStock, icon: "⚠️", color: "#f59e0b" },
    { label: "Out of Stock", value: stats.outOfStock, icon: "🚫", color: "#ef4444" },
    { label: "Expiring Soon", value: stats.expiringSoon, icon: "⏳", color: "#8b5cf6" },
    { label: "Expired", value: stats.expired, icon: "💔", color: "#dc2626" },
    { label: "Suppliers", value: stats.totalSuppliers, icon: "🏭", color: "#10b981" },
  ];

  return (
    <div className="fade-in">
      <h2 style={s.title}>Dashboard</h2>
      <div style={s.statsGrid}>
        {statCards.map(c => (
          <div key={c.label} style={{ ...s.statCard, borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: "1.2rem" }}>{c.icon}</div>
            <div style={{ ...s.statVal, color: c.color }}>{c.value}</div>
            <div style={s.statLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      {alerts.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>⚠️ Active Alerts</h3>
            <button style={s.linkBtn} onClick={() => navigate("/alerts")}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {alerts.slice(0, 5).map((a, i) => (
              <div key={i} style={{ ...s.alertItem, borderLeft: `3px solid ${a.type === "out" || a.type === "expired" ? "#ef4444" : "#f59e0b"}` }}>
                <span>{a.icon}</span>
                <span style={{ fontSize: "0.82rem", color: "#374151", flex: 1 }}>{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h3 style={s.sectionTitle}>📋 Recent Medicines</h3>
          <button style={s.linkBtn} onClick={() => navigate("/medicines")}>View all →</button>
        </div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{["Medicine", "Category", "Stock", "Expiry", "Status"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {medicines.map(m => (
                <tr key={m._id} style={s.tr}>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{m.batchNo}</div>
                  </td>
                  <td style={s.td}><CategoryBadge category={m.category} /></td>
                  <td style={s.td}>{m.stock} {m.unit}</td>
                  <td style={s.td}>{new Date(m.expiryDate).toLocaleDateString("en-IN")}</td>
                  <td style={s.td}><StockBadge stock={m.stock} minStock={m.minStock} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem" }}>
      <div style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }}>⚕️</div>
    </div>
  );
}

const s = {
  title: { fontSize: "1.3rem", fontWeight: 800, color: "#0f4c81", marginBottom: "0.9rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.6rem", marginBottom: "1.2rem" },
  statCard: { background: "#fff", borderRadius: 12, padding: "0.8rem 0.7rem", boxShadow: "0 1px 6px rgba(0,0,0,.07)" },
  statVal: { fontSize: "1.4rem", fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: "0.6rem", color: "#6b7280", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" },
  section: { marginBottom: "1.2rem" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" },
  sectionTitle: { fontSize: "0.9rem", fontWeight: 700, color: "#374151" },
  linkBtn: { background: "none", border: "none", color: "#1a73e8", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" },
  alertItem: { background: "#fff", borderRadius: 8, padding: "0.6rem 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 1px 4px rgba(0,0,0,.06)" },
  tableWrap: { overflowX: "auto", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,.07)" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden" },
  th: { background: "#f8fafc", padding: "0.6rem 0.7rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "0.65rem 0.7rem", fontSize: "0.82rem", color: "#374151", verticalAlign: "middle" },
};