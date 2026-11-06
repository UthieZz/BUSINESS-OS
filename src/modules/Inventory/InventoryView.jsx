import { useEffect, useState, useCallback } from "react";
import inventoryService from "../../services/InventoryService";
import processor from "../../processor/ProcessorService";

const LOW_STOCK_GRAMS = 100;

export default function InventoryView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await inventoryService.getAssets(search, lowStockOnly);
      setItems(data);
      try {
        const totals = await inventoryService.getTotals();
        processor.setState("inventory", totals);
      } catch {
        /* offline ok */
      }
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

  const openAdd = () =>
    setEditing({ name: "", strain: "", weight: "", value: "" });

  const openEdit = (item) =>
    setEditing({
      id: item.id,
      name: item.name || "",
      strain: item.strain || "",
      weight: item.weight ?? "",
      value: item.value ?? "",
    });

  const cancelEdit = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    const weight = Number(editing.weight);
    if (!editing.name.trim() || isNaN(weight) || weight < 0) {
      setError("Name and valid weight (>=0) required");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const payload = {
        name: editing.name.trim(),
        strain: editing.strain.trim(),
        weight,
        value: Number(editing.value) || 0,
      };
      if (editing.id) {
        await inventoryService.updateAsset(editing.id, payload);
      } else {
        await inventoryService.addAsset(payload);
      }
      setEditing(null);
      await refresh();
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    setBusy(true);
    setError("");
    try {
      await inventoryService.removeAsset(confirmDelete);
      setConfirmDelete(null);
      await refresh();
    } catch (e) {
      setError(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ color: "var(--text)", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: "var(--text-h)" }}>Vault</h2>
        <button
          onClick={openAdd}
          disabled={busy}
          style={{
            background: "var(--accent)",
            color: "#0A0A0C",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Item
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Search name or strain…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 180px",
            background: "#111114",
            border: "1px solid #333",
            color: "var(--text)",
            padding: "8px 10px",
            borderRadius: 6,
          }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Low stock only (<{LOW_STOCK_GRAMS}g)
        </label>
      </div>

      {error && (
        <div style={{ background: "#3f1d1d", color: "#fca5a5", padding: 10, borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading vault…</p>
      ) : items.length === 0 ? (
        <p style={{ color: "#888" }}>No items match. Add stock or clear filters.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: "var(--card-bg)",
                border: "1px solid #222",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-h)" }}>
                  {item.name || "(unnamed)"}
                  {item.strain ? ` · ${item.strain}` : ""}
                </div>
                <div style={{ fontSize: 14, color: "#aaa", marginTop: 4 }}>
                  {item.weight ?? 0}g · R{Number(item.value || 0).toFixed(2)}
                  {item.lowStock || (item.weight || 0) < LOW_STOCK_GRAMS ? (
                    <span style={{ color: "#f59e0b", marginLeft: 8 }}>⚠ Low</span>
                  ) : null}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => openEdit(item)}
                  disabled={busy}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--gold)",
                    color: "var(--gold)",
                    padding: "6px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(item.id)}
                  disabled={busy}
                  style={{
                    background: "transparent",
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    padding: "6px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 16,
          }}
          onClick={cancelEdit}
        >
          <div
            style={{
              background: "#0A0A0C",
              border: "1px solid var(--gold)",
              borderRadius: 10,
              padding: 20,
              width: "100%",
              maxWidth: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 12px", color: "var(--text-h)" }}>
              {editing.id ? "Edit item" : "Add item"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                placeholder="Name"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                style={inputStyle}
              />
              <input
                placeholder="Strain"
                value={editing.strain}
                onChange={(e) => setEditing({ ...editing, strain: e.target.value })}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Weight (g)"
                value={editing.weight}
                onChange={(e) => setEditing({ ...editing, weight: e.target.value })}
                style={inputStyle}
                min="0"
                step="0.1"
              />
              <input
                type="number"
                placeholder="Value (R)"
                value={editing.value}
                onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                style={inputStyle}
                min="0"
                step="0.01"
              />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
              <button onClick={cancelEdit} disabled={busy} style={btnGhost}>
                Cancel
              </button>
              <button onClick={save} disabled={busy} style={btnPrimary}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 16,
          }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            style={{
              background: "#0A0A0C",
              border: "1px solid #ef4444",
              borderRadius: 10,
              padding: 20,
              width: "100%",
              maxWidth: 360,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px", color: "#ef4444" }}>Delete item?</h3>
            <p style={{ margin: "0 0 16px", color: "#aaa" }}>
              This removes the vault record. Cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} disabled={busy} style={btnGhost}>
                Cancel
              </button>
              <button onClick={doDelete} disabled={busy} style={{ ...btnPrimary, background: "#ef4444", color: "#fff" }}>
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  background: "#111114",
  border: "1px solid #333",
  color: "var(--text)",
  padding: "8px 10px",
  borderRadius: 6,
  width: "100%",
  boxSizing: "border-box",
};

const btnPrimary = {
  background: "var(--accent)",
  color: "#0A0A0C",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};

const btnGhost = {
  background: "transparent",
  border: "1px solid #444",
  color: "var(--text)",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};
