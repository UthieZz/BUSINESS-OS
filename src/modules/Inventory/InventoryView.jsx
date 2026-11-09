import { useEffect, useState, useCallback } from "react";
import inventoryService from "../../services/InventoryService";
import processor from "../../processor/ProcessorService";

export default function InventoryView() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // id or null
  const [form, setForm] = useState({ name: "", weight: "", value: "", strain: "" });
  const [sellId, setSellId] = useState(null);
  const [sellGrams, setSellGrams] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await inventoryService.getAssets(search, lowStockOnly);
      setItems(data);
      // Keep processor in sync for Dashboard
      const totals = await inventoryService.getTotals();
      processor.setState("inventory", totals);
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

  return (
    <div style={{ color: "var(--text)" }}>
      <h2 style={{ color: "var(--accent)", marginTop: 0 }}>Vault / Inventory</h2>

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
            background: "#111",
            border: "1px solid #333",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 4,
            flex: "1 1 200px",
          }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#ccc" }}>
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
            padding: "8px 14px",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Add / Edit form */}
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
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              flex: 1,
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
                padding: "8px 12px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
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
                  {item.weight ?? 0} g · R{item.value ?? 0}
                  {item.lowStock && <span style={{ color: "#f59e0b", marginLeft: 8 }}>· LOW</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => startEdit(item)} style={btnSecondary}>Edit</button>
                <button onClick={() => setSellId(item.id)} style={btnGold}>Sell</button>
                <button onClick={() => requestDelete(item.id)} style={btnDanger}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
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
              <button type="button" onClick={confirmDelete} style={{ ...btnDanger, flex: 1, background: "#ef4444", color: "#fff", border: "none", fontWeight: "bold" }}>Delete</button>
              <button type="button" onClick={() => setDeleteId(null)} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Sell modal / inline */}
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
              style={{ ...inputStyle, width: "100%", marginBottom: 12 }}
              autoFocus
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={{ ...btnAccent, flex: 1 }}>Confirm Sell</button>
              <button type="button" onClick={() => setSellId(null)} style={btnSecondary}>Cancel</button>
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
  padding: "8px 10px",
  borderRadius: 4,
  width: "100%",
  boxSizing: "border-box",
};

const btnAccent = {
  background: "var(--accent)",
  color: "#0A0A0C",
  border: "none",
  padding: "8px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: "bold",
};

const btnSecondary = {
  background: "transparent",
  border: "1px solid #555",
  color: "#ddd",
  padding: "6px 12px",
  borderRadius: 4,
  cursor: "pointer",
};

const btnGold = {
  background: "transparent",
  border: "1px solid var(--gold)",
  color: "var(--gold)",
  padding: "6px 12px",
  borderRadius: 4,
  cursor: "pointer",
};

const btnDanger = {
  background: "transparent",
  border: "1px solid #ef4444",
  color: "#ef4444",
  padding: "6px 12px",
  borderRadius: 4,
  cursor: "pointer",
};
