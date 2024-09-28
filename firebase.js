// Import Firebase SDK and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaAuum7Imm26BFr2F1-t98CyiC8wnFGiQ",
  authDomain: "inventory-management-app-1ea8a.firebaseapp.com",
  projectId: "inventory-management-app-1ea8a",
  storageBucket: "inventory-management-app-1ea8a.appspot.com",
  messagingSenderId: "776870885738",
  appId: "1:776870885738:web:861a6ef10c17ae657dcd13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (add this)
const firestore = getFirestore(app);

export { firestore };
