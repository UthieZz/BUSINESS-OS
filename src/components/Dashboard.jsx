import { useEffect, useState } from "react";
import Card from "./Card";
import processor from "../processor/ProcessorService";
import { useApp } from "../context/AppContext";

function formatZAR(n) {
  const num = Number(n) || 0;
  return `R${num.toFixed(2)}`;
}

function Dashboard() {
  const { setActiveModule } = useApp();
  const [inventory, setInventory] = useState(
    () => processor.getState("inventory") || {}
  );
  const [sales, setSales] = useState(
    () => processor.getState("sales") || {}
  );

  useEffect(() => {
    const onState = ({ key }) => {
      if (key === "inventory") {
        setInventory(processor.getState("inventory") || {});
      }
      if (key === "sales") {
        setSales(processor.getState("sales") || {});
      }
    };
    // Seed + subscribe (unsubscribe on unmount)
    setInventory(processor.getState("inventory") || {});
    setSales(processor.getState("sales") || {});
    const unsub = processor.on("stateChanged", onState);
    return unsub;
  }, []);

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
          subtitle={formatZAR(inventory.inventoryValue)}
          status="success"
          onClick={() => setActiveModule("inventory")}
        />

        <Card
          icon="⚖️"
          title="Stock Weight"
          value={`${(inventory.totalWeight ?? 0).toFixed(1)} g`}
          subtitle="Current Inventory"
          status="info"
          onClick={() => setActiveModule("inventory")}
        />

        <Card
          icon="⚠️"
          title="Low Stock"
          value={inventory.lowStockAlerts ?? 0}
          subtitle="Requires Attention"
          status={inventory.lowStockAlerts > 0 ? "warning" : "success"}
          onClick={() => setActiveModule("inventory")}
        />

        <Card
          icon="🛒"
          title="Sales"
          value={`${sales.salesCount ?? 0} Sales`}
          subtitle={formatZAR(sales.totalRevenue)}
          status="success"
          onClick={() => setActiveModule("sales")}
        />

        <Card
          icon="💰"
          title="Cash Flow"
          value="—"
          subtitle="Residual — open module"
          onClick={() => setActiveModule("cashflow")}
        />

        <Card
          icon="🧠"
          title="Oracle"
          value="—"
          subtitle="Residual — open module"
          onClick={() => setActiveModule("oracle")}
        />
      </div>
    </div>
  );
}

export default Dashboard;
