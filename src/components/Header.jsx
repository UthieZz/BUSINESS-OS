function Header() {
  return (
    <header
      style={{
        height: "72px",
        background: "#0A0A0C",
        borderBottom: "1px solid #d4af37",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div>
        <h2 style={{ margin: 0, color: "#00FF66" }}>Business OS</h2>
        <small style={{ color: "#d4af37" }}>StokeD⁴T Command Center</small>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ color: "#00FF66", fontWeight: "bold" }}>● ONLINE</span>
        <span style={{ color: "#888" }}>Sprint Zero</span>
      </div>
    </header>
  );
}

export default Header;
