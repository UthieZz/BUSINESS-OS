import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Credentials via Vite env only. Never commit real keys.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

// Guard: empty config must not crash module import at build/dev start.
let app = null;
let db = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  console.warn(
    "[firebase] Missing VITE_FIREBASE_* env. Vault calls will fail until configured."
  );
}

export { db };

/**
 * Locked path segments for Firestore.
 * Use as: collection(db, ...PATHS.VAULT)
 * Do not invent new top-level roots.
 *
 * VAULT = collection under doc tracker/currentCycle
 * (collection / doc / collection)
 */
export const PATHS = {
  VAULT: ["tracker", "currentCycle", "vault"],
  INVESTORS: ["tracker", "currentCycle", "investors"],
  SALES: ["sales"],
  DROP_REQUESTS: ["drop_requests"],
};
