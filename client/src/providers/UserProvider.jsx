import axios from "axios";
import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const logoutUser = async () => {
  try {
    await signOut(auth);
    await axios.post("/api/sessionLogOut", {}, { withCredentials: true });
  } catch (error) {
    console.error(error);
  }
};

const shouldRevalidateSession = () => {
  const sessionCache = localStorage.getItem("sessionCache");
  if (!sessionCache) return true;

  const { timestamp } = JSON.parse(sessionCache);
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return currentTime - timestamp > fiveMinutes;
};

const setSessionCache = (isAuthenticated) => {
  const sessionCache = {
    isAuthenticated,
    timestamp: Date.now(),
  };
  localStorage.setItem("sessionCache", JSON.stringify(sessionCache));
};

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setLoading(false);
    });

    const checkState = async () => {
      try {
        if (shouldRevalidateSession()) {
          const response = await axios.get("/api/auth/validateSession", {
            withCredentials: true,
          });
          const { isAuthenticated } = response.data;
          setSessionCache(isAuthenticated);
        }
      } catch (error) {
        if (currentUser) {
          toast.error("Authentication error. Please login again.");
        }
        console.error("Error validating session:", error);
        localStorage.removeItem("sessionCache");
        setCurrentUser(null);
        setLoading(false);
        logoutUser();
      }
    };

    checkState();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
