import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";
import Processor from "../processor/Processor";
import { useApp } from "../context/AppContext";
import InventoryView from "../modules/Inventory/InventoryView";
import Inventory from "../modules/Inventory/Inventory";

function App() {
  const { activeModule } = useApp();

  const renderModule = () => {
    if (activeModule === "dashboard") {
      return <Dashboard />;
    }
    if (activeModule === "inventory") {
      return (
        <>
          <Inventory />
          <InventoryView />
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
