import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { StockBadge, ExpiryBadge, CategoryBadge } from "../components/Badges";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { Toast, useToast } from "../components/Toast";
import { FormGrid, FormGroup, Input, Select } from "../components/FormFields";

const CATEGORIES = ["Analgesic","Antibiotic","Antidiabetic","Cardiac","Antihistamine","Antacid","Vitamin","Antifungal","Other"];
const EMPTY = { name:"", category:"Analgesic", stock:"", minStock:"", unit:"Tablets", expiryDate:"", supplier:"", price:"", batchNo:"" };

export default function MedicinesPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast } = useToast();
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [modal, setModal] = useState(null); // {mode:"add"|"edit", data:{}}
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCat !== "All") params.category = filterCat;
      const [meds, sups] = await Promise.all([
        api.get("/medicines", { params }),
        api.get("/suppliers"),
      ]);
      setMedicines(meds.data.data);
      setSuppliers(sups.data.data);
    } catch { showToast("Failed to load medicines", "error"); }
    setLoading(false);
  }, [search, filterCat]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY); setModal({ mode: "add" }); };
  const openEdit = (m) => {
    setForm({
      ...m,
      supplier: m.supplier?._id || m.supplier,
      expiryDate: m.expiryDate ? m.expiryDate.split("T")[0] : "",
    });
    setModal({ mode: "edit", id: m._id });
  };

  const save = async () => {
    if (!form.name || !form.stock || !form.expiryDate || !form.supplier) {
      showToast("Fill all required fields", "error"); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, stock: Number(form.stock), minStock: Number(form.minStock), price: Number(form.price) };
      if (modal.mode === "add") {
        await api.post("/medicines", payload);
        showToast("Medicine added");
      } else {
        await api.put(`/medicines/${modal.id}`, payload);
        showToast("Medicine updated");
      }
      setModal(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
    }
    setSaving(false);
  };

  const deleteMed = async () => {
    try {
      await api.delete(`/medicines/${deleteId}`);
      showToast("Medicine deleted", "error");
      setDeleteId(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fade-in">
      <div style={s.pageHeader}>
        <h2 style={s.title}>Medicines</h2>
        <button style={s.btnPrimary} onClick={openAdd}>+ Add</button>
      </div>

      <div style={s.filterBar}>
        <input style={s.search} placeholder="🔍 Search name or batch..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={s.select} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="All">All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={s.count}>{medicines.length} medicine{medicines.length !== 1 ? "s" : ""}</div>

      {loading ? (
        <div style={s.empty}>Loading…</div>
      ) : medicines.length === 0 ? (
        <div style={s.emptyState}><div style={{ fontSize: "2.5rem" }}>💊</div><div>No medicines found</div></div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{["Medicine","Category","Stock","Min","Expiry","Supplier","Price",""].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {medicines.map(m => (
                <tr key={m._id} style={s.tr}>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>#{m.batchNo}</div>
                    <StockBadge stock={m.stock} minStock={m.minStock} />
                  </td>
                  <td style={s.td}><CategoryBadge category={m.category} /></td>
                  <td style={s.td}>{m.stock} {m.unit}</td>
                  <td style={s.td}>{m.minStock}</td>
                  <td style={s.td}>
                    <div style={{ fontSize: "0.78rem" }}>{new Date(m.expiryDate).toLocaleDateString("en-IN")}</div>
                    <ExpiryBadge expiryDate={m.expiryDate} />
                  </td>
                  <td style={s.td}>{m.supplier?.name || "—"}</td>
                  <td style={s.td}>₹{Number(m.price).toFixed(2)}</td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={s.btnEdit} onClick={() => openEdit(m)}>✏️</button>
                      {isAdmin && <button style={s.btnDel} onClick={() => setDeleteId(m._id)}>🗑️</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add Medicine" : "Edit Medicine"} onClose={() => setModal(null)} onSave={save} saveLabel={saving ? "Saving…" : modal.mode === "add" ? "Add Medicine" : "Save Changes"} saveDisabled={saving}>
          <FormGrid>
            <FormGroup label="Medicine Name *"><Input value={form.name} onChange={e => f("name", e.target.value)} placeholder="e.g. Paracetamol 500mg" /></FormGroup>
            <FormGroup label="Batch No."><Input value={form.batchNo} onChange={e => f("batchNo", e.target.value)} placeholder="SP2024A" /></FormGroup>
            <FormGroup label="Category">
              <Select value={form.category} onChange={e => f("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Unit"><Input value={form.unit} onChange={e => f("unit", e.target.value)} placeholder="Tablets" /></FormGroup>
            <FormGroup label="Stock *"><Input type="number" value={form.stock} onChange={e => f("stock", e.target.value)} placeholder="0" min="0" /></FormGroup>
            <FormGroup label="Min Stock Alert"><Input type="number" value={form.minStock} onChange={e => f("minStock", e.target.value)} placeholder="0" min="0" /></FormGroup>
            <FormGroup label="Price (₹)"><Input type="number" value={form.price} onChange={e => f("price", e.target.value)} placeholder="0.00" min="0" step="0.01" /></FormGroup>
            <FormGroup label="Expiry Date *"><Input type="date" value={form.expiryDate} onChange={e => f("expiryDate", e.target.value)} /></FormGroup>
            <FormGroup label="Supplier *" fullWidth>
              <Select value={form.supplier} onChange={e => f("supplier", e.target.value)}>
                <option value="">Select supplier</option>
                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </Select>
            </FormGroup>
          </FormGrid>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog message="Delete this medicine? This cannot be undone." onConfirm={deleteMed} onCancel={() => setDeleteId(null)} />
      )}
      <Toast toast={toast} />
    </div>
  );
}

const s = {
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" },
  title: { fontSize: "1.3rem", fontWeight: 800, color: "#0f4c81" },
  btnPrimary: { background: "linear-gradient(135deg,#1a73e8,#0f4c81)", color: "#fff", border: "none", borderRadius: 8, padding: "0.55rem 1rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" },
  filterBar: { display: "flex", gap: "0.5rem", marginBottom: "0.6rem" },
  search: { flex: 1, border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.55rem 0.75rem", fontSize: "0.85rem", background: "#fff", outline: "none", fontFamily: "inherit" },
  select: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.55rem 0.5rem", fontSize: "0.8rem", background: "#fff", outline: "none", fontFamily: "inherit" },
  count: { fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem" },
  empty: { textAlign: "center", padding: "2rem", color: "#9ca3af" },
  emptyState: { textAlign: "center", padding: "3rem 1rem", color: "#6b7280", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" },
  tableWrap: { overflowX: "auto", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,.07)" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", minWidth: 700 },
  th: { background: "#f8fafc", padding: "0.6rem 0.7rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "0.65rem 0.7rem", fontSize: "0.82rem", color: "#374151", verticalAlign: "middle" },
  btnEdit: { background: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: 6, padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.78rem" },
  btnDel: { background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 6, padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.78rem" },
};