import { useEffect } from "react";
import processor from "../../processor/ProcessorService";
import inventoryService from "../../services/InventoryService";

/**
 * Inventory engine: registers with processor and seeds state.
 * Does not render UI (see App vault view / InventoryView).
 */
export default function Inventory() {
  useEffect(() => {
    let cancelled = false;

    const module = {
      async init() {
        try {
          const totals = await inventoryService.getTotals();
          if (!cancelled) {
            processor.setState("inventory", totals);
            console.log("[Inventory] Engine initialized");
          }
        } catch (e) {
          console.warn("[Inventory] Init failed (expected if Firebase unconfigured):", e.message);
          if (!cancelled) {
            processor.setState("inventory", {
              status: "OFFLINE",
              assets: 0,
              totalWeight: 0,
              inventoryValue: 0,
              lowStockAlerts: 0,
              items: [],
              lastUpdated: new Date().toISOString(),
            });
          }
        }
      },
    };

    processor.register("Inventory", module);
    module.init();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
