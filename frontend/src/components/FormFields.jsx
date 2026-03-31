export function FormGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>{children}</div>;
}

export function FormGroup({ label, fullWidth, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.6rem 0.75rem",
  fontSize: "0.85rem", outline: "none", width: "100%", background: "#f9fafb",
  boxSizing: "border-box",
};

export function Input({ ...props }) {
  return <input style={inputStyle} {...props} />;
}

export function Select({ children, ...props }) {
  return <select style={inputStyle} {...props}>{children}</select>;
}