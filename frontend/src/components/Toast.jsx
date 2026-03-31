import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, showToast };
}

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: 82, left: "50%", transform: "translateX(-50%)",
      background: toast.type === "error" ? "#ef4444" : "#10b981",
      color: "#fff", borderRadius: 10, padding: "0.7rem 1.3rem",
      fontSize: "0.85rem", fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,.2)",
      zIndex: 500, whiteSpace: "nowrap", animation: "slideUp 0.2s ease",
    }}>
      {toast.type === "error" ? "❌" : "✅"} {toast.msg}
    </div>
  );
}