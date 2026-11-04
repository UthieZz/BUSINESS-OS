import { useEffect, useState, useCallback } from "react";
import processor from "../../processor/ProcessorService";
import inventoryService from "../../services/InventoryService";

const emptyForm = { name: "", weight: "", value: "" };

const fieldStyle = {
  padding: "8px 12px",
  marginRight: 8,
  marginBottom: 8,
  background: "#0A0A0C",
  color: "#00FF66",
  border: "1px solid #d4af37",
  borderRadius: 4,
  width: "100%",
  maxWidth: 280,
  boxSizing: "border-box",
};

const btnPrimary = {
  padding: "8px 14px",
  background: "#00FF66",
  color: "#0A0A0C",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: 600,
  marginRight: 8,
};

const btnGold = {
  padding: "6px 10px",
  background: "#d4af37",
  color: "#0A0A0C",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  marginRight: 8,
};

const btnDanger = {
  padding: "6px 10px",
  background: "transparent",
  color: "#ff6b6b",
  border: "1px solid #ff6b6b",
  borderRadius: 4,
  cursor: "pointer",
};

export default function InventoryView() {
  const [inventory, setInventory] = useState({ items: [] });
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const totals = await inventoryService.getTotals();
      const filtered = await inventoryService.getAssets(search, lowOnly);
      setInventory({ ...totals, items: filtered });
      processor.setState("inventory", totals);
    } catch (e) {
      setError(e.message || "Failed to load vault");
    } finally {
      setLoading(false);
    }
  }, [search, lowOnly]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || item.strain || "",
      weight: String(item.weight ?? ""),
      value: String(item.value ?? ""),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const weight = Number(form.weight);
    const value = Number(form.value);
    if (!name || !Number.isFinite(weight) || weight < 0 || !Number.isFinite(value) || value < 0) {
      setError("Name required; weight and value must be non-negative numbers");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { name, weight, value, lowStock: weight < 100 };
      if (editingId) {
        await inventoryService.updateAsset(editingId, payload);
      } else {
        await inventoryService.addAsset(payload);
      }
      resetForm();
      await refresh();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeAsset = async (id) => {
    if (!confirm("Delete this vault item?")) return;
    try {
      await inventoryService.removeAsset(id);
      if (editingId === id) resetForm();
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  const items = inventory.items || [];

  return (
    <div>
      <h1 style={{ margin: 0, color: "#fff" }}>📦 Inventory</h1>
      <p style={{ margin: "6px 0 16px", color: "#888" }}>
        Status: {inventory.status || "OFFLINE"} · {items.length} assets ·{" "}
        {inventory.totalWeight ?? 0} g · R{inventory.inventoryValue ?? 0}
      </p>

      <form onSubmit={handleSave} style={{ border: "1px solid #d4af37", borderRadius: 8, padding: 16, marginBottom: 20, background: "#111114" }}>
        <h3 style={{ margin: "0 0 12px", color: "#d4af37" }}>
          {editingId ? "Edit vault item" : "Add vault item"}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <input
            placeholder="Name / strain"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            style={fieldStyle}
            required
          />
          <input
            type="number"
            min="0"
            step="any"
            placeholder="Weight (g)"
            value={form.weight}
            onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
            style={fieldStyle}
            required
          />
          <input
            type="number"
            min="0"
            step="any"
            placeholder="Value (R)"
            value={form.value}
            onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
            style={fieldStyle}
            required
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={saving} style={btnPrimary}>
            {saving ? "Saving…" : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={btnGold}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Search vault (name/strain)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={fieldStyle}
        />
        <label style={{ color: "#d4af37", marginRight: 12 }}>
          <input
            type="checkbox"
            checked={lowOnly}
            onChange={(e) => setLowOnly(e.target.checked)}
          />{" "}
          Low stock only
        </label>
        <button type="button" onClick={refresh} style={btnPrimary}>
          Refresh
        </button>
      </div>

      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      {loading && <p>Loading vault...</p>}

      {items.length === 0 && !loading ? (
        <p style={{ color: "#888" }}>No inventory items.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #333",
              borderRadius: 8,
              padding: 14,
              marginBottom: 12,
              background: "#141416",
              color: "#fff",
            }}
          >
            <h3 style={{ margin: "0 0 6px", color: "#d4af37" }}>{item.name || item.strain || "Unnamed"}</h3>
            <p style={{ margin: "0 0 4px" }}>Weight: {item.weight} g</p>
            <p style={{ margin: "0 0 4px" }}>Value: R{item.value}</p>
            <p style={{ margin: "0 0 8px" }}>
              {item.lowStock || (item.weight || 0) < 100 ? "🟡 Low Stock" : "🟢 Healthy"}
            </p>
            <button type="button" onClick={() => startEdit(item)} style={btnGold}>
              Edit
            </button>
            <button type="button" onClick={() => removeAsset(item.id)} style={btnDanger}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
