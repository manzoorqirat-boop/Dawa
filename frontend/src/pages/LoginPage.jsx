import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <span style={s.logoIcon}>⚕</span>
          <div style={s.logoText}>Dawa</div>
          <div style={s.logoSub}>दवा इन्वेंटरी</div>
        </div>
        <h2 style={s.title}>Sign in to your account</h2>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.group}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="admin@dawa.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div style={s.hint}>
          <div>Demo: <b>admin@dawa.com</b> / Admin@123</div>
          <div>Staff: <b>staff@dawa.com</b> / Staff@123</div>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg,#0f4c81,#1a73e8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
  card: { background: "#fff", borderRadius: 20, padding: "2rem 1.5rem", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", animation: "slideUp 0.3s ease" },
  logoWrap: { textAlign: "center", marginBottom: "1.25rem" },
  logoIcon: { fontSize: "2.5rem" },
  logoText: { fontWeight: 800, fontSize: "1.5rem", color: "#0f4c81" },
  logoSub: { color: "#6b7280", fontSize: "0.75rem", letterSpacing: "0.1em" },
  title: { fontSize: "1rem", fontWeight: 700, color: "#374151", textAlign: "center", marginBottom: "1.25rem" },
  error: { background: "#fee2e2", color: "#991b1b", borderRadius: 8, padding: "0.65rem 0.85rem", fontSize: "0.82rem", marginBottom: "1rem", fontWeight: 600 },
  form: { display: "flex", flexDirection: "column", gap: "0.9rem" },
  group: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { fontSize: "0.75rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.7rem 0.85rem", fontSize: "0.9rem", outline: "none", background: "#f9fafb", fontFamily: "inherit" },
  btn: { background: "linear-gradient(135deg,#1a73e8,#0f4c81)", color: "#fff", border: "none", borderRadius: 10, padding: "0.8rem", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", marginTop: "0.25rem" },
  hint: { marginTop: "1.25rem", padding: "0.75rem", background: "#f8fafc", borderRadius: 8, fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.8, textAlign: "center" },
};