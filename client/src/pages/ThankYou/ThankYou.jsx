import { useCallback, useEffect, useState } from "react";
import { UserContext } from "../../providers/UserContext";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./ThankYou.module.css";

const ThankYou = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const getPosts = useCallback(async () => {
    try {
      const auth = getAuth();
      const idToken = await getIdToken(auth.currentUser);
      const posts = await axios.get(`/api/thank-you/messages`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      console.log(posts);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <main>
      ThankYou
      {dataLoaded ? (
        <div>notloaded</div>
      ) : (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      )}
    </main>
  );
};

export default ThankYou;
