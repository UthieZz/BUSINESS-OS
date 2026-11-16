import { useEffect, useState, useCallback } from "react";
import salesService from "../../services/SalesService";
import processor from "../../processor/ProcessorService";
import inventoryService from "../../services/InventoryService";
import { isFirebaseConfigured } from "../../lib/firebase.js";

function formatZAR(n) {
  const num = Number(n) || 0;
  return `R${num.toFixed(2)}`;
}

export default function SalesView() {
  const [sales, setSales] = useState([]);
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ itemId: "", grams: "", unitPrice: "", notes: "" });

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, vaultData] = await Promise.all([
        salesService.getSales(),
        inventoryService.getAssets(),
      ]);
      setSales(salesData);
      setVaultItems(vaultData);
      const salesTotals = await salesService.getTotals();
      processor.setState("sales", salesTotals);
    } catch (e) {
      setError(e.message || "Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await salesService.recordSale(form);
      setForm({ itemId: "", grams: "", unitPrice: "", notes: "" });
      await refresh();
    } catch (err) {
      setError(err.message || "Sale failed");
    }
  };

  return (
    <div style={{ color: "var(--text)" }}>
      <h2 style={{ color: "var(--accent)", marginTop: 0 }}>Sales</h2>

      {!isFirebaseConfigured && (
        <div style={{ background: "#3a2a1a", color: "#f59e0b", padding: 12, borderRadius: 6, marginBottom: 12 }}>
          Firebase not configured. Sales require live Vault.
        </div>
      )}

      {error && (
        <div style={{ background: "#3a1a1a", color: "#ff6b6b", padding: 12, borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        }}
      >
        <select
          required
          value={form.itemId}
          onChange={(e) => setForm({ ...form, itemId: e.target.value })}
          style={inputStyle}
        >
          <option value="">Select vault item</option>
          {vaultItems.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name || "Unnamed"} ({i.weight ?? 0}g)
            </option>
          ))}
        </select>
        <input
          type="number"
          required
          min="0.1"
          step="0.1"
          placeholder="Grams"
          value={form.grams}
          onChange={(e) => setForm({ ...form, grams: e.target.value })}
          style={inputStyle}
        />
        <input
          type="number"
          required
          min="0"
          step="0.01"
          placeholder="Unit price (R/g)"
          value={form.unitPrice}
          onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "var(--accent)",
            color: "#0A0A0C",
            border: "none",
            padding: "10px 16px",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
            minHeight: 44,
          }}
        >
          Record Sale
        </button>
      </form>

      <button
        type="button"
        onClick={refresh}
        disabled={loading}
        style={{
          background: "transparent",
          border: "1px solid var(--accent)",
          color: "var(--accent)",
          padding: "8px 14px",
          borderRadius: 4,
          marginBottom: 16,
          minHeight: 44,
        }}
      >
        {loading ? "Loading..." : "Refresh"}
      </button>

      {sales.length === 0 ? (
        <p style={{ color: "#888" }}>No sales recorded yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {sales.map((s) => {
            const item = vaultItems.find((i) => i.id === s.itemId);
            const itemName = item?.name || s.itemId || "Unknown";
            return (
            <div
              key={s.id}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 14,
              }}
            >
              <div>
                <strong style={{ color: "var(--gold)" }}>{s.grams}g</strong> · {formatZAR(s.total)}
                <span style={{ color: "#999", marginLeft: 8 }}>({formatZAR(s.unitPrice)}/g)</span>
              </div>
              <div style={{ fontSize: 13, color: "#ccc", marginTop: 4 }}>
                Item: {itemName} · Stock {s.stockBefore} → {s.stockAfter}g
                {s.notes && ` · ${s.notes}`}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  background: "#111",
  border: "1px solid #333",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: 4,
  width: "100%",
  boxSizing: "border-box",
  minHeight: 44,
};
