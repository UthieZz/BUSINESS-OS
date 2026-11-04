import { useApp } from "../context/AppContext";

function Header() {
  const { toggleSidebar } = useApp();

  return (
    <header
      style={{
        height: "72px",
        background: "#0A0A0C",
        borderBottom: "1px solid #d4af37",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "relative",
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          style={{
            display: "none",
            background: "transparent",
            border: "1px solid #d4af37",
            color: "#00FF66",
            padding: "6px 10px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 18,
          }}
          className="mobile-only"
        >
          ☰
        </button>
        <div>
          <h2 style={{ margin: 0, color: "#00FF66", fontSize: 20 }}>Business OS</h2>
          <small style={{ color: "#d4af37" }}>StokeD⁴T Command Center</small>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ color: "#00FF66", fontWeight: "bold" }}>● ONLINE</span>
        <span style={{ color: "#888" }}>Sprint Zero</span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-only { display: block !important; }
        }
      `}</style>
    </header>
  );
}

export default Header;
