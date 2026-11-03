import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db, PATHS } from "../lib/firebase.js";

const vaultRef = () => collection(db, PATHS.VAULT);

class InventoryService {
  async getAssets(search = "", lowStockOnly = false) {
    const snap = await getDocs(vaultRef());
    let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          (i.name || "").toLowerCase().includes(q) ||
          (i.strain || "").toLowerCase().includes(q)
      );
    }
    if (lowStockOnly) {
      items = items.filter((i) => i.lowStock || (i.weight || 0) < 100);
    }
    return items;
  }

  async getTotals() {
    const items = await this.getAssets();
    return {
      status: "LIVE",
      assets: items.length,
      totalWeight: items.reduce((s, i) => s + (Number(i.weight) || 0), 0),
      inventoryValue: items.reduce((s, i) => s + (Number(i.value) || 0), 0),
      lowStockAlerts: items.filter((i) => i.lowStock || (i.weight || 0) < 100)
        .length,
      items,
      lastUpdated: new Date().toISOString(),
    };
  }

  async addAsset(asset) {
    const ref = await addDoc(vaultRef(), {
      ...asset,
      createdAt: serverTimestamp(),
      lowStock: (asset.weight || 0) < 100,
    });
    return { id: ref.id, ...asset };
  }

  async updateAsset(id, updates) {
    const ref = doc(db, PATHS.VAULT, id);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
    return { id, ...updates };
  }

  async removeAsset(id) {
    await deleteDoc(doc(db, PATHS.VAULT, id));
  }

  // Atomic stock decrement for future sales. Uses Firestore transaction.
  async decrementStock(id, grams) {
    const ref = doc(db, PATHS.VAULT, id);
    return runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error("Vault item not found");
      const data = snap.data();
      const current = Number(data.weight) || 0;
      if (current < grams) throw new Error("Insufficient stock");
      const newWeight = current - grams;
      tx.update(ref, {
        weight: newWeight,
        lowStock: newWeight < 100,
        updatedAt: serverTimestamp(),
      });
      return { id, previous: current, newWeight };
    });
  }
}

export default new InventoryService();
