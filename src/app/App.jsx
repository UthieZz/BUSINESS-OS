import { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";
import Processor from "../processor/Processor";
import processor from "../processor/ProcessorService";
import inventoryService from "../services/InventoryService";
import { useApp } from "../context/AppContext";

function App() {
  const { activeModule } = useApp();
  const [inventory, setInventory] = useState({ items: [] });
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const totals = await inventoryService.getTotals();
      const filtered = await inventoryService.getAssets(search, lowOnly);
      setInventory({ ...totals, items: filtered });
      processor.setState("inventory", totals);
    } catch (e) {
      setError(e.message || "Failed to load vault");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, lowOnly]);

  useEffect(() => {
    refresh();
    processor.on("stateChanged", ({ key }) => {
      if (key === "inventory") refresh();
    });
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this vault item?")) return;
    try {
      await inventoryService.removeAsset(id);
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  const renderModule = () => {
    if (activeModule === "dashboard" || activeModule === "inventory") {
      return (
        <>
          {activeModule === "dashboard" && <Dashboard />}
          <div style={{ marginBottom: 16 }}>
            <input
              placeholder="Search vault (name/strain)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 12px",
                marginRight: 8,
                background: "#0A0A0C",
                color: "#00FF66",
                border: "1px solid #d4af37",
                borderRadius: 4,
              }}
            />
            <label style={{ color: "#d4af37", marginRight: 12 }}>
              <input
                type="checkbox"
                checked={lowOnly}
                onChange={(e) => setLowOnly(e.target.checked)}
              />{" "}
              Low stock only
            </label>
            <button
              onClick={refresh}
              style={{
                padding: "8px 12px",
                background: "#00FF66",
                color: "#0A0A0C",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>
          {error && <p style={{ color: "#ff4444" }}>{error}</p>}
          {loading && <p>Loading vault...</p>}
          <h2>📦 Vault Items</h2>
          {inventory.items?.length === 0 && !loading && <p>No items.</p>}
          {inventory.items?.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #d4af37",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                background: "#0A0A0C",
                color: "#fff",
              }}
            >
              <h3 style={{ color: "#00FF66" }}>{item.name || item.strain || "Unnamed"}</h3>
              <p>Weight: {item.weight || 0} g</p>
              <p>Value: R{item.value || 0}</p>
              <p>{item.lowStock || (item.weight || 0) < 100 ? "🟡 Low" : "🟢 OK"}</p>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  background: "#d4af37",
                  color: "#0A0A0C",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </>
      );
    }
    return (
      <div>
        <h2>{activeModule.toUpperCase()}</h2>
        <p>Module placeholder — Sprint residual.</p>
      </div>
    );
  };

  return (
    <Layout>
      {renderModule()}
      <Processor />
    </Layout>
  );
}

export default App;
