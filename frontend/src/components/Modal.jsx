export default function Modal({ title, onClose, onSave, saveLabel = "Save", children, saveDisabled = false }) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.title}>{title}</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.body}>{children}</div>
        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...s.saveBtn, opacity: saveDisabled ? 0.6 : 1 }} onClick={onSave} disabled={saveDisabled}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
  modal: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.25)", animation: "slideUp 0.2s ease" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid #f3f4f6" },
  title: { fontWeight: 800, fontSize: "1rem", margin: 0, color: "#0f4c81" },
  closeBtn: { background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#9ca3af" },
  body: { padding: "1rem 1.25rem" },
  footer: { display: "flex", gap: "0.5rem", justifyContent: "flex-end", padding: "0.85rem 1.25rem", borderTop: "1px solid #f3f4f6" },
  cancelBtn: { background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "0.55rem 1rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" },
  saveBtn: { background: "linear-gradient(135deg,#1a73e8,#0f4c81)", color: "#fff", border: "none", borderRadius: 8, padding: "0.55rem 1.1rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" },
};