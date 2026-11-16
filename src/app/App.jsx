import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";
import Processor from "../processor/Processor";
import { useApp } from "../context/AppContext";
import InventoryView from "../modules/Inventory/InventoryView";
import Inventory from "../modules/Inventory/Inventory";
import SalesView from "../modules/Sales/SalesView";
import Sales from "../modules/Sales/Sales";

function App() {
  const { activeModule } = useApp();

  const renderModule = () => {
    if (activeModule === "dashboard") {
      return <Dashboard />;
    }
    if (activeModule === "inventory") {
      return <InventoryView />;
    }
    if (activeModule === "sales") {
      return <SalesView />;
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
      <Inventory />
      <Sales />
      {renderModule()}
      <Processor />
    </Layout>
  );
}

export default App;
