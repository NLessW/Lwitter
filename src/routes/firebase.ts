import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4qoVt2crulCw266woauCAiUI_4GWqTe0",
  authDomain: "lwitter-reloaded-821fd.firebaseapp.com",
  projectId: "lwitter-reloaded-821fd",
  storageBucket: "lwitter-reloaded-821fd.firebasestorage.app",
  messagingSenderId: "882591633975",
  appId: "1:882591633975:web:98fdb99c206162446da5b2",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
