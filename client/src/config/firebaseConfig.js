import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVtQBKuiJSkswk-oe-dib0UtRZMPOIePI",
  authDomain: "scope-a8a0d.firebaseapp.com",
  projectId: "scope-a8a0d",
  storageBucket: "scope-a8a0d.appspot.com",
  messagingSenderId: "756097699904",
  appId: "1:756097699904:web:6c6b91f69b6d8b15ba8fa5",
  measurementId: "G-FNKG72L35L",
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
setPersistence(auth, browserLocalPersistence);

export { fbApp, auth };
