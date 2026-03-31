import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { Toast, useToast } from "../components/Toast";
import { FormGrid, FormGroup, Input } from "../components/FormFields";

const EMPTY = { name: "", contact: "", email: "", address: "" };

export default function SuppliersPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/suppliers");
      setSuppliers(data.data);
    } catch { showToast("Failed to load suppliers", "error"); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (s) => { setForm({ ...s }); setModal({ mode: "edit", id: s._id }); };

  const save = async () => {
    if (!form.name || !form.contact) { showToast("Name and contact are required", "error"); return; }
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await api.post("/suppliers", form);
        showToast("Supplier added");
      } else {
        await api.put(`/suppliers/${modal.id}`, form);
        showToast("Supplier updated");
      }
      setModal(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
    }
    setSaving(false);
  };

  const deleteSup = async () => {
    try {
      await api.delete(`/suppliers/${deleteId}`);
      showToast("Supplier removed", "error");
      setDeleteId(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Cannot delete supplier", "error");
      setDeleteId(null);
    }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fade-in">
      <div style={s.pageHeader}>
        <h2 style={s.title}>Suppliers</h2>
        {isAdmin && <button style={s.btnPrimary} onClick={openAdd}>+ Add</button>}
      </div>

      {loading ? (
        <div style={s.empty}>Loading…</div>
      ) : suppliers.length === 0 ? (
        <div style={s.emptyState}><div style={{ fontSize: "2.5rem" }}>🏭</div><div>No suppliers yet</div></div>
      ) : (
        <div style={s.grid}>
          {suppliers.map(sup => (
            <div key={sup._id} style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.avatar}>{sup.name[0]}</div>
                <div>
                  <div style={s.supName}>{sup.name}</div>
                  <div style={s.supCount}>{sup.medicineCount} medicine{sup.medicineCount !== 1 ? "s" : ""}</div>
                </div>
              </div>
              <div style={s.details}>
                <div style={s.detail}>📞 {sup.contact}</div>
                {sup.email && <div style={s.detail}>✉️ {sup.email}</div>}
                {sup.address && <div style={s.detail}>📍 {sup.address}</div>}
              </div>
              {isAdmin && (
                <div style={{ display: "flex", gap: 8, marginTop: "0.75rem" }}>
                  <button style={s.btnEdit} onClick={() => openEdit(sup)}>✏️ Edit</button>
                  <button style={s.btnDel} onClick={() => setDeleteId(sup._id)}>🗑️ Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add Supplier" : "Edit Supplier"} onClose={() => setModal(null)} onSave={save} saveLabel={saving ? "Saving…" : modal.mode === "add" ? "Add Supplier" : "Save Changes"} saveDisabled={saving}>
          <FormGrid>
            <FormGroup label="Supplier Name *"><Input value={form.name} onChange={e => f("name", e.target.value)} placeholder="Company name" /></FormGroup>
            <FormGroup label="Contact *"><Input value={form.contact} onChange={e => f("contact", e.target.value)} placeholder="+91 XXXXX XXXXX" /></FormGroup>
            <FormGroup label="Email"><Input type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="email@supplier.com" /></FormGroup>
            <FormGroup label="Address"><Input value={form.address} onChange={e => f("address", e.target.value)} placeholder="City, State" /></FormGroup>
          </FormGrid>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog message="Delete this supplier? This will fail if medicines are linked to them." onConfirm={deleteSup} onCancel={() => setDeleteId(null)} />
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
  emptyState: { textAlign: "center", padding: "3rem 1rem", color: "#6b7280", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" },
  grid: { display: "grid", gap: "0.75rem" },
  card: { background: "#fff", borderRadius: 12, padding: "1rem", boxShadow: "0 1px 6px rgba(0,0,0,.07)" },
  cardHeader: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" },
  avatar: { width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#1a73e8,#0f4c81)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1rem", flexShrink: 0 },
  supName: { fontWeight: 700, color: "#1f2937" },
  supCount: { fontSize: "0.72rem", color: "#6b7280" },
  details: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  detail: { fontSize: "0.8rem", color: "#6b7280" },
  btnEdit: { background: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: 6, padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 },
  btnDel: { background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 6, padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 },
};