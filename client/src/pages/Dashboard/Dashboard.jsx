import { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import searchStyles from "../../components/SearchBar/SearchBar.module.css";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);

  const fetchUserReviews = async (user) => {
    try {
      const idToken = await user.getIdToken(true);
      const response = await axios.get("/api/user/reviews", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserReviews(user);
      } else {
        console.log("No user is currently signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className={styles.dashboardMain}>
      <h1>Dashboard</h1>
      <SearchBar className={searchStyles.searchBlock} />
      <section className={styles.userReviews}>
        <h2>Recent Reviews</h2>
        <div className={styles.reviewsContainer}>
          {reviews.map((review, index) => {
            return (
              <div key={index} className={styles.reviewSingle}>
                <h3>{review.courseId.courseCode}</h3>
                <p>{review.courseId.courseName}</p>
                <p>{review.userComment}</p>
                <p>{parseFloat(review.courseRating).toFixed(2)}</p>
                <p>{parseFloat(review.profRating).toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
