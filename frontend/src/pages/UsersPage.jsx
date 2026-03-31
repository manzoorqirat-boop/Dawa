import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { RoleBadge } from "../components/Badges";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { Toast, useToast } from "../components/Toast";
import { FormGrid, FormGroup, Input, Select } from "../components/FormFields";

const EMPTY = { name: "", email: "", password: "", role: "staff" };

export default function UsersPage() {
  const { toast, showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [newPass, setNewPass] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.data);
    } catch { showToast("Failed to load users", "error"); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, role: u.role, isActive: u.isActive, password: "" }); setModal({ mode: "edit", id: u._id }); };

  const save = async () => {
    if (!form.name || !form.email) { showToast("Name and email are required", "error"); return; }
    if (modal.mode === "add" && !form.password) { showToast("Password is required", "error"); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (modal.mode === "add") {
        await api.post("/users", payload);
        showToast("User created");
      } else {
        await api.put(`/users/${modal.id}`, payload);
        showToast("User updated");
      }
      setModal(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
    }
    setSaving(false);
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/users/${deleteId}`);
      showToast("User deleted", "error");
      setDeleteId(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
      setDeleteId(null);
    }
  };

  const resetPassword = async () => {
    if (!newPass || newPass.length < 6) { showToast("Min 6 characters", "error"); return; }
    try {
      await api.put(`/users/${resetModal}/reset-password`, { newPassword: newPass });
      showToast("Password reset");
      setResetModal(null);
      setNewPass("");
    } catch (err) {
      showToast(err.response?.data?.message || "Reset failed", "error");
    }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fade-in">
      <div style={s.pageHeader}>
        <h2 style={s.title}>Users</h2>
        <button style={s.btnPrimary} onClick={openAdd}>+ Add User</button>
      </div>

      {loading ? (
        <div style={s.empty}>Loading…</div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{["Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={s.tr}>
                  <td style={s.td}>
                    <div style={s.avatar}>{u.name[0]}</div>
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </td>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}><RoleBadge role={u.role} /></td>
                  <td style={s.td}>
                    <span style={{ background: u.isActive ? "#d1fae5" : "#fee2e2", color: u.isActive ? "#065f46" : "#991b1b", borderRadius: 20, padding: "2px 8px", fontSize: "0.68rem", fontWeight: 700 }}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={s.td}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <button style={s.btnEdit} onClick={() => openEdit(u)}>✏️</button>
                      <button style={s.btnEdit} onClick={() => { setResetModal(u._id); setNewPass(""); }} title="Reset password">🔑</button>
                      <button style={s.btnDel} onClick={() => setDeleteId(u._id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add User" : "Edit User"} onClose={() => setModal(null)} onSave={save} saveLabel={saving ? "Saving…" : modal.mode === "add" ? "Create User" : "Save Changes"} saveDisabled={saving}>
          <FormGrid>
            <FormGroup label="Full Name *"><Input value={form.name} onChange={e => f("name", e.target.value)} placeholder="Full name" /></FormGroup>
            <FormGroup label="Email *"><Input type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="email@example.com" /></FormGroup>
            {modal.mode === "add" && (
              <FormGroup label="Password *"><Input type="password" value={form.password} onChange={e => f("password", e.target.value)} placeholder="Min 6 characters" /></FormGroup>
            )}
            <FormGroup label="Role">
              <Select value={form.role} onChange={e => f("role", e.target.value)}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </Select>
            </FormGroup>
            {modal.mode === "edit" && (
              <FormGroup label="Status">
                <Select value={form.isActive ? "true" : "false"} onChange={e => f("isActive", e.target.value === "true")}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </FormGroup>
            )}
          </FormGrid>
        </Modal>
      )}

      {resetModal && (
        <Modal title="Reset Password" onClose={() => setResetModal(null)} onSave={resetPassword} saveLabel="Reset Password">
          <FormGroup label="New Password">
            <Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 6 characters" />
          </FormGroup>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog message="Delete this user permanently?" onConfirm={deleteUser} onCancel={() => setDeleteId(null)} />
      )}
      <Toast toast={toast} />
    </div>
  );
}

const s = {
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" },
  title: { fontSize: "1.3rem", fontWeight: 800, color: "#0f4c81" },
  btnPrimary: { background: "linear-gradient(135deg,#1a73e8,#0f4c81)", color: "#fff", border: "none", borderRadius: 8, padding: "0.55rem 1rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" },
  empty: { textAlign: "center", padding: "2rem", color: "#9ca3af" },
  tableWrap: { overflowX: "auto", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,.07)" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", minWidth: 600 },
  th: { background: "#f8fafc", padding: "0.6rem 0.7rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "0.65rem 0.7rem", fontSize: "0.82rem", color: "#374151", verticalAlign: "middle" },
  avatar: { width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#1a73e8,#0f4c81)", color: "#fff", fontWeight: 800, fontSize: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center", marginRight: 8 },
  btnEdit: { background: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: 6, padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.78rem" },
  btnDel: { background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 6, padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.78rem" },
};