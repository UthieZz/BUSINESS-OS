import { useEffect, useState } from "react";
import Card from "./Card";
import processor from "../processor/ProcessorService";
import { useApp } from "../context/AppContext";

function Dashboard() {
  const { setActiveModule } = useApp();
  const [inventory, setInventory] = useState(
    () => processor.getState("inventory") || {}
  );

  useEffect(() => {
    const onState = ({ key }) => {
      if (key === "inventory") {
        setInventory(processor.getState("inventory") || {});
      }
    };
    // Seed + subscribe (unsubscribe on unmount)
    setInventory(processor.getState("inventory") || {});
    const unsub = processor.on("stateChanged", onState);
    return unsub;
  }, []);

  const goToInventory = () => setActiveModule("inventory");

  return (
    <div style={{ marginBottom: "30px" }}>
      <h1 style={{ color: "#00FF66" }}>Business OS</h1>

      <h2 style={{ color: "#d4af37" }}>📊 Command Center</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <Card
          icon="📦"
          title="Inventory"
          value={`${inventory.assets ?? 0} Assets`}
          subtitle={`R${inventory.inventoryValue ?? 0}`}
          status="success"
          onClick={goToInventory}
        />

        <Card
          icon="⚖️"
          title="Stock Weight"
          value={`${inventory.totalWeight ?? 0} g`}
          subtitle="Current Inventory"
          status="info"
          onClick={goToInventory}
        />

        <Card
          icon="⚠️"
          title="Low Stock"
          value={inventory.lowStockAlerts ?? 0}
          subtitle="Requires Attention"
          status={inventory.lowStockAlerts > 0 ? "warning" : "success"}
          onClick={goToInventory}
        />

        <Card
          icon="💰"
          title="Cash Flow"
          value="Coming Soon"
          subtitle="Sprint 2"
        />

        <Card
          icon="🛒"
          title="Sales"
          value="Coming Soon"
          subtitle="Sprint 3"
        />

        <Card
          icon="🧠"
          title="Oracle"
          value="Monitoring..."
          subtitle="AI Layer"
        />
      </div>
    </div>
  );
}

export default Dashboard;
