import { useEffect, useState, useCallback } from "react";
import inventoryService from "../../services/InventoryService";
import processor from "../../processor/ProcessorService";
import { isFirebaseConfigured } from "../../lib/firebase.js";

function formatZAR(n) {
  const num = Number(n) || 0;
  return `R${num.toFixed(2)}`;
}

export default function InventoryView() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", weight: "", value: "", strain: "" });
  const [sellId, setSellId] = useState(null);
  const [sellGrams, setSellGrams] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await inventoryService.getAssets(search, lowStockOnly);
      setItems(data);
      const totals = await inventoryService.getTotals();
      processor.setState("inventory", totals);
      setLastUpdated(totals.lastUpdated);
    } catch (e) {
      setError(e.message || "Failed to load vault");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, lowStockOnly]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const resetForm = () => {
    setForm({ name: "", weight: "", value: "", strain: "" });
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await inventoryService.updateAsset(editing, form);
      } else {
        await inventoryService.addAsset(form);
      }
      resetForm();
      await refresh();
    } catch (err) {
      setError(err.message || "Save failed");
    }
  };

  const requestDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await inventoryService.removeAsset(deleteId);
      setDeleteId(null);
      await refresh();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({
      name: item.name || "",
      weight: item.weight ?? "",
      value: item.value ?? "",
      strain: item.strain || "",
    });
  };

  const handleSell = async (e) => {
    e.preventDefault();
    const grams = Number(sellGrams);
    if (!sellId || !grams || grams <= 0) {
      setError("Enter positive grams to sell");
      return;
    }
    try {
      await inventoryService.decrementStock(sellId, grams);
      setSellId(null);
      setSellGrams("");
      await refresh();
    } catch (err) {
      setError(err.message || "Sell failed");
    }
  };

  const totalWeight = items.reduce((s, i) => s + (Number(i.weight) || 0), 0);
  const totalValue = items.reduce((s, i) => s + (Number(i.value) || 0), 0);

  return (
    <div style={{ color: "var(--text)" }}>
      <h2 style={{ color: "var(--accent)", marginTop: 0 }}>Vault / Inventory</h2>

      {!isFirebaseConfigured && (
        <div style={{ background: "#3a2a1a", color: "#f59e0b", padding: 12, borderRadius: 6, marginBottom: 12, border: "1px solid #f59e0b" }}>
          <strong>OFFLINE — Firebase not configured.</strong>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>
            Copy <code>.env.example</code> to <code>.env</code>, fill <code>VITE_FIREBASE_*</code> values from your Firebase console, then restart <code>npm run dev</code>. Vault reads/writes and <code>decrementStock</code> transactions require live config.
          </p>
        </div>
      )}

      {error && (
        <div style={{ background: "#3a1a1a", color: "#ff6b6b", padding: 12, borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <input
          type="search"
          placeholder="Search name or strain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            padding: "10px 14px",
            borderRadius: 4,
            flex: "1 1 200px",
            minHeight: 44,
          }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#ccc", minHeight: 44 }}>
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Low stock only
        </label>
        <button
          type="button"
          onClick={refresh}
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
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

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
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        }}
      >
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Strain (optional)"
          value={form.strain}
          onChange={(e) => setForm({ ...form, strain: e.target.value })}
          style={inputStyle}
        />
        <input
          type="number"
          required
          min="0"
          step="0.1"
          placeholder="Weight (g)"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          style={inputStyle}
        />
        <input
          type="number"
          required
          min="0"
          step="0.01"
          placeholder="Value (R)"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          style={inputStyle}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
          <button
            type="submit"
            style={{
              background: "var(--accent)",
              color: "#0A0A0C",
              border: "none",
              padding: "10px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              flex: 1,
              minHeight: 44,
            }}
          >
            {editing ? "Update" : "Add to Vault"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                background: "transparent",
                border: "1px solid #666",
                color: "#ccc",
                padding: "10px 12px",
                borderRadius: 4,
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {items.length > 0 && (
        <div style={{ marginBottom: 12, color: "var(--gold)", fontSize: 14 }}>
          Showing {items.length} item{items.length !== 1 ? "s" : ""} · {totalWeight.toFixed(1)} g · {formatZAR(totalValue)}
          {lastUpdated && <span style={{ color: "#888", marginLeft: 8 }}>· updated {new Date(lastUpdated).toLocaleTimeString()}</span>}
        </div>
      )}

      {loading && items.length === 0 ? (
        <p>Loading vault...</p>
      ) : items.length === 0 ? (
        <p style={{ color: "#888" }}>No items in vault{search || lowStockOnly ? " matching filters" : ""}.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: "var(--card-bg)",
                border: `1px solid ${item.lowStock ? "#f59e0b" : "var(--border)"}`,
                borderRadius: 8,
                padding: 14,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <strong style={{ color: "var(--accent)" }}>{item.name || "Unnamed"}</strong>
                {item.strain && <span style={{ color: "#999", marginLeft: 8 }}>({item.strain})</span>}
                <div style={{ fontSize: 14, color: "#ccc", marginTop: 4 }}>
                  {item.weight ?? 0} g · {formatZAR(item.value)}
                  {item.lowStock && <span style={{ color: "#f59e0b", marginLeft: 8 }}>· LOW</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => startEdit(item)} style={{ ...btnSecondary, minHeight: 44, padding: "10px 14px" }}>Edit</button>
                <button onClick={() => setSellId(item.id)} style={{ ...btnGold, minHeight: 44, padding: "10px 14px" }}>Sell</button>
                <button onClick={() => requestDelete(item.id)} style={{ ...btnDanger, minHeight: 44, padding: "10px 14px" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setDeleteId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0A0A0C",
              border: "1px solid #ef4444",
              borderRadius: 8,
              padding: 20,
              minWidth: 280,
              maxWidth: "90vw",
            }}
          >
            <h3 style={{ margin: "0 0 12px", color: "#ef4444" }}>Delete vault item?</h3>
            <p style={{ color: "#ccc", margin: "0 0 16px" }}>This cannot be undone. The item will be removed from the vault.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={confirmDelete} style={{ ...btnDanger, flex: 1, background: "#ef4444", color: "#fff", border: "none", fontWeight: "bold", minHeight: 44 }}>Delete</button>
              <button type="button" onClick={() => setDeleteId(null)} style={{ ...btnSecondary, minHeight: 44 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {sellId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setSellId(null)}
        >
          <form
            onSubmit={handleSell}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0A0A0C",
              border: "1px solid var(--gold)",
              borderRadius: 8,
              padding: 20,
              minWidth: 280,
            }}
          >
            <h3 style={{ margin: "0 0 12px", color: "var(--gold)" }}>Sell / Decrement Stock</h3>
            <input
              type="number"
              required
              min="0.1"
              step="0.1"
              placeholder="Grams to sell"
              value={sellGrams}
              onChange={(e) => setSellGrams(e.target.value)}
              style={{ ...inputStyle, width: "100%", marginBottom: 12, minHeight: 44 }}
              autoFocus
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={{ ...btnAccent, flex: 1, minHeight: 44 }}>Confirm Sell</button>
              <button type="button" onClick={() => setSellId(null)} style={{ ...btnSecondary, minHeight: 44 }}>Cancel</button>
            </div>
          </form>
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

const btnAccent = {
  background: "var(--accent)",
  color: "#0A0A0C",
  border: "none",
  padding: "10px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: "bold",
};

const btnSecondary = {
  background: "transparent",
  border: "1px solid #555",
  color: "#ddd",
  padding: "8px 12px",
  borderRadius: 4,
  cursor: "pointer",
};

const btnGold = {
  background: "transparent",
  border: "1px solid var(--gold)",
  color: "var(--gold)",
  padding: "8px 12px",
  borderRadius: 4,
  cursor: "pointer",
};

const btnDanger = {
  background: "transparent",
  border: "1px solid #ef4444",
  color: "#ef4444",
  padding: "8px 12px",
  borderRadius: 4,
  cursor: "pointer",
};
