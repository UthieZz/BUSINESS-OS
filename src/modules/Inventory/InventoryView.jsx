import { useEffect, useState } from "react";
import processor from "../../processor/ProcessorService";
import inventoryService from "../../services/InventoryService";

export default function InventoryView() {
  const [inventory, setInventory] = useState(
    processor.getState("inventory") || inventoryService.getTotals()
  );

  useEffect(() => {
    const refresh = () => {
      setInventory(processor.getState("inventory") || inventoryService.getTotals());
    };

    refresh();

    processor.on("stateChanged", ({ key }) => {
      if (key === "inventory") refresh();
    });
  }, []);

  const sync = (totals) => {
    processor.setState("inventory", totals);
    setInventory(totals);
  };

  const addTestAsset = () => {
    inventoryService.addAsset({
      name: "Gelato",
      weight: 250,
      value: 9500,
      lowStock: false,
    });
    sync(inventoryService.getTotals());
  };

  const removeAsset = (id) => {
    const totals = inventoryService.removeAsset(id);
    sync(totals);
  };

  const items = inventory.items || [];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#fff" }}>📦 Inventory</h1>
          <p style={{ margin: "6px 0 0", color: "#888" }}>
            Status: {inventory.status || "OFFLINE"} · {items.length} assets ·{" "}
            {inventory.totalWeight ?? 0} g · R{inventory.inventoryValue ?? 0}
          </p>
        </div>

        <button
          onClick={addTestAsset}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "15px",
            background: "#0A0A0C",
            color: "#00FF66",
            border: "1px solid #00FF66",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          ➕ Add Test Asset
        </button>
      </div>

      {items.length === 0 ? (
        <p style={{ color: "#888" }}>No inventory items.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "14px",
              marginBottom: "12px",
              background: "#141416",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 6px", color: "#d4af37" }}>{item.name}</h3>
              <p style={{ margin: "0 0 4px" }}>⚖️ Weight: {item.weight} g</p>
              <p style={{ margin: "0 0 4px" }}>💰 Value: R{item.value}</p>
              <p style={{ margin: 0 }}>
                {item.lowStock ? "🟡 Low Stock" : "🟢 Healthy"}
              </p>
            </div>

            <button
              onClick={() => removeAsset(item.id)}
              style={{
                padding: "8px 14px",
                cursor: "pointer",
                background: "transparent",
                color: "#ff6b6b",
                border: "1px solid #ff6b6b",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
