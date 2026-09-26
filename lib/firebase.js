import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIfA0PPG53cSW9CdAIin0GiYv5aP4QJZ8",
  authDomain: "marketplace-app-75f58.firebaseapp.com",
  projectId: "marketplace-app-75f58",
  storageBucket: "marketplace-app-75f58.firebasestorage.app",
  messagingSenderId: "276017914248",
  appId: "1:276017914248:web:0d1a03b56f29eed1879a3d"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };