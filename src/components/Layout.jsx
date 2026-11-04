import Header from "./Header";
import Sidebar from "./Sidebar";
import { useApp } from "../context/AppContext";

function Layout({ children }) {
  const { sidebarOpen, closeSidebar } = useApp();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0C",
        color: "#fff",
      }}
    >
      <Header />

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 10,
            display: "none",
          }}
          className="backdrop"
        />
      )}

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "16px",
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .backdrop { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default Layout;
