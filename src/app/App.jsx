import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";
import Processor from "../processor/Processor";
import processor from "../processor/ProcessorService";
import inventoryService from "../services/InventoryService";
import { useApp } from "../context/AppContext";
import InventoryView from "../modules/Inventory/InventoryView";

function Placeholder({ title }) {
  return (
    <div>
      <h1 style={{ color: "#fff" }}>{title}</h1>
      <p style={{ color: "#888" }}>Module shell — not implemented yet.</p>
    </div>
  );
}

function App() {
  const { activeModule } = useApp();
  const [inventory, setInventory] = useState(
    processor.getState("inventory") || {}
  );

  useEffect(() => {
    // Seed processor from service once so Dashboard has live numbers
    if (!processor.getState("inventory")) {
      processor.setState("inventory", inventoryService.getTotals());
    }

    const refresh = () => {
      setInventory(processor.getState("inventory") || {});
    };

    refresh();

    processor.on("stateChanged", ({ key }) => {
      if (key === "inventory") refresh();
    });
  }, []);

  let content;
  switch (activeModule) {
    case "inventory":
      content = <InventoryView />;
      break;
    case "sales":
      content = <Placeholder title="🛒 Sales" />;
      break;
    case "cashflow":
      content = <Placeholder title="💰 Cash Flow" />;
      break;
    case "projects":
      content = <Placeholder title="📁 Projects" />;
      break;
    case "investors":
      content = <Placeholder title="👥 Investors" />;
      break;
    case "oracle":
      content = <Placeholder title="🧠 Oracle" />;
      break;
    case "settings":
      content = <Placeholder title="⚙ Settings" />;
      break;
    case "dashboard":
    default:
      content = (
        <>
          <Dashboard />
          <Processor />
        </>
      );
  }

  return <Layout>{content}</Layout>;
}

export default App;
