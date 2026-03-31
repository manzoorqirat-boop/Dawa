export function StockBadge({ stock, minStock }) {
  if (stock === 0) return <Badge color="red">Out of Stock</Badge>;
  if (stock < minStock) return <Badge color="yellow">Low Stock</Badge>;
  return <Badge color="green">In Stock</Badge>;
}

export function ExpiryBadge({ expiryDate }) {
  const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return <Badge color="red">Expired</Badge>;
  if (days <= 90) return <Badge color="yellow">{days}d left</Badge>;
  return <Badge color="green">{days}d left</Badge>;
}

function Badge({ color, children }) {
  const colors = {
    green:  { background: "#d1fae5", color: "#065f46" },
    yellow: { background: "#fef3c7", color: "#92400e" },
    red:    { background: "#fee2e2", color: "#991b1b" },
  };
  return (
    <span style={{ ...colors[color], borderRadius: 20, padding: "2px 8px", fontSize: "0.68rem", fontWeight: 700, display: "inline-block" }}>
      {children}
    </span>
  );
}

export function RoleBadge({ role }) {
  return (
    <span style={{
      background: role === "admin" ? "#dbeafe" : "#d1fae5",
      color: role === "admin" ? "#1e40af" : "#065f46",
      borderRadius: 20, padding: "2px 10px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
    }}>
      {role}
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span style={{ background: "#eff6ff", color: "#1d4ed8", borderRadius: 20, padding: "2px 8px", fontSize: "0.7rem", fontWeight: 600 }}>
      {category}
    </span>
  );
}