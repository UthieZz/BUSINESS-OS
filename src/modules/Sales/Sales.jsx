import { useEffect } from "react";
import processor from "../../processor/ProcessorService";
import salesService from "../../services/SalesService";

/**
 * Sales engine: registers with processor and seeds state.
 * Does not render UI (see SalesView).
 */
export default function Sales() {
  useEffect(() => {
    let cancelled = false;

    const module = {
      async init() {
        try {
          const totals = await salesService.getTotals();
          if (!cancelled) {
            processor.setState("sales", totals);
            console.log("[Sales] Engine initialized");
          }
        } catch (e) {
          console.warn("[Sales] Init failed (expected if Firebase unconfigured):", e.message);
          if (!cancelled) {
            processor.setState("sales", {
              status: "OFFLINE",
              salesCount: 0,
              totalRevenue: 0,
              totalGrams: 0,
              sales: [],
              lastUpdated: new Date().toISOString(),
            });
          }
        }
      },
    };

    processor.register("Sales", module);
    module.init();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
