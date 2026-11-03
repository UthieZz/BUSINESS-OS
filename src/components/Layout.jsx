import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0C",
        color: "#fff",
      }}
    >
      <Header />

      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "24px",
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
