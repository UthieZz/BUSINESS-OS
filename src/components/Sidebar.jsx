import { useApp } from "../context/AppContext";

function Sidebar() {
  const { activeModule, setActiveModule, sidebarOpen, closeSidebar } = useApp();

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

  const handleSelect = (id) => {
    setActiveModule(id);
    closeSidebar();
  };

  return (
    <aside
      style={{
        width: sidebarOpen ? "240px" : "0px",
        background: "#0A0A0C",
        borderRight: "1px solid #333",
        padding: sidebarOpen ? "24px 0" : "0",
        minHeight: "calc(100vh - 72px)",
        overflow: "hidden",
        transition: "width 0.2s ease",
        position: "relative",
        zIndex: 15,
      }}
      className="sidebar"
    >
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => handleSelect(item.id)}
          style={{
            padding: "14px 24px",
            cursor: "pointer",
            color: activeModule === item.id ? "#00FF66" : "#ddd",
            background: activeModule === item.id ? "#222" : "transparent",
            fontWeight: activeModule === item.id ? "bold" : "normal",
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </div>
      ))}

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            top: 72px;
            left: 0;
            height: calc(100vh - 72px);
            width: ${sidebarOpen ? "240px" : "0"} !important;
            box-shadow: ${sidebarOpen ? "4px 0 12px rgba(0,0,0,0.6)" : "none"};
          }
        }
        @media (min-width: 769px) {
          .sidebar {
            width: 240px !important;
            padding: 24px 0 !important;
          }
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;
