import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, PATHS, isFirebaseConfigured } from "../lib/firebase.js";
import inventoryService from "./InventoryService.js";

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase not configured");
  }
  return db;
}

const salesCollection = () => collection(requireDb(), ...PATHS.SALES);

class SalesService {
  async getSales() {
    const snap = await getDocs(salesCollection());
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async recordSale({ itemId, grams, unitPrice, notes = "" }) {
    const gramsNum = Number(grams);
    const priceNum = Number(unitPrice) || 0;
    if (!itemId || gramsNum <= 0) {
      throw new Error("Valid itemId and positive grams required");
    }

    // Atomic stock decrement first
    const stockResult = await inventoryService.decrementStock(itemId, gramsNum);

    const total = gramsNum * priceNum;
    const sale = {
      itemId,
      grams: gramsNum,
      unitPrice: priceNum,
      total,
      notes,
      stockBefore: stockResult.previous,
      stockAfter: stockResult.newWeight,
      createdAt: serverTimestamp(),
    };

    const ref = await addDoc(salesCollection(), sale);
    return { id: ref.id, ...sale };
  }
}

export default new SalesService();
