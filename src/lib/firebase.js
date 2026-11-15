import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Credentials via Vite env; confirmed project config as fallback.
// Client config is public; rules + Auth enforce access. Never commit private keys.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDWnDaA9pIibbI9s3s0CSRg_ORfg2uOWL0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "stoked4t.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "stoked4t",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "stoked4t.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "499210795671",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:499210795671:web:631e854676943c09be07d2",
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
