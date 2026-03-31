export default function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = "Delete", confirmColor = "#ef4444" }) {
  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.box} onClick={e => e.stopPropagation()}>
        <div style={s.icon}>⚠️</div>
        <p style={s.msg}>{message}</p>
        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onCancel}>Cancel</button>
          <button style={{ ...s.confirmBtn, background: confirmColor }} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
  box: { background: "#fff", borderRadius: 16, padding: "1.5rem 1.25rem", maxWidth: 340, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.2)", animation: "slideUp 0.2s ease" },
  icon: { fontSize: "2rem", marginBottom: "0.75rem" },
  msg: { color: "#4b5563", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.25rem" },
  actions: { display: "flex", gap: "0.5rem", justifyContent: "center" },
  cancelBtn: { background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "0.55rem 1.1rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" },
  confirmBtn: { color: "#fff", border: "none", borderRadius: 8, padding: "0.55rem 1.1rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" },
};