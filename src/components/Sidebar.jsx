import { useApp } from "../context/AppContext";

function Sidebar() {
  const { activeModule, setActiveModule } = useApp();

  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "inventory", label: "📦 Inventory" },
    { id: "sales", label: "🛒 Sales" },
    { id: "cashflow", label: "💰 Cash Flow" },
    { id: "projects", label: "📁 Projects" },
    { id: "investors", label: "👥 Investors" },
    { id: "oracle", label: "🧠 Oracle" },
    { id: "settings", label: "⚙ Settings" },
  ];

  return (
    <aside
      style={{
        width: "240px",
        background: "#0A0A0C",
        borderRight: "1px solid #333",
        padding: "24px 0",
        minHeight: "calc(100vh - 72px)",
      }}
    >
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => setActiveModule(item.id)}
          style={{
            padding: "14px 24px",
            cursor: "pointer",
            color: activeModule === item.id ? "#00FF66" : "#ddd",
            background:
              activeModule === item.id ? "#222" : "transparent",
            fontWeight: activeModule === item.id ? "bold" : "normal",
            transition: "0.2s",
          }}
        >
          {item.label}
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;
