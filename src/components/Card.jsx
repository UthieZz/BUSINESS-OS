function Card({
  title,
  value,
  subtitle,
  icon,
  status = "default",
  onClick,
  children,
}) {
  const borderColors = {
    default: "#444",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${borderColors[status] || "var(--border)"}`,
        borderRadius: "12px",
        padding: "18px",
        minHeight: "140px",
        transition: "0.2s ease",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {icon && <span>{icon}</span>}
          {title}
        </h3>

        <h2
          style={{
            margin: 0,
            fontSize: "30px",
          }}
        >
          {value}
        </h2>

        {subtitle && (
          <p
            style={{
              marginTop: "8px",
              color: "#999",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

export default Card;
