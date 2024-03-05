import axios from "axios";
import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    const checkState = async () => {
      try {
        const response = await axios.get("/api/auth/validateSession");
        const { isAuthenticated } = response.data;

        if (isAuthenticated) {
          unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user || null);
          });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error validating session:", error);
        setCurrentUser(null);
      }
    };

    checkState();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
