import axios from "axios";
import { useEffect, useState, useCallback } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import convertDate from "../../utils/convertDate.js";

import { Rating, Pagination, CircularProgress } from "@mui/material";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";

import searchStyles from "../../components/SearchBar/SearchBar.module.css";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;
  const [reviews, setReviews] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchUserReviews = useCallback(
    async (user) => {
      try {
        const idToken = await user.getIdToken(true);
        const response = await axios.get(
          `/api/user/reviews?&page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        setReviews(response.data.reviews);
        setTotalPages(response.data.totalPages);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    [page]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserReviews(user);
      } else {
        console.log("No user is currently signed in.");
      }
    });

    return () => unsubscribe();
  }, [fetchUserReviews]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <main className={styles.dashboardMain}>
      <h1>Dashboard</h1>
      <SearchBar className={searchStyles.searchBlock} />
      {dataLoaded ? (
        <section className={styles.userReviews}>
          <h2>Recent Reviews</h2>
          <div className={styles.reviewsContainer}>
            {reviews.map((review, index) => {
              return (
                <div key={index} className={styles.reviewSingle}>
                  {console.log(review)}
                  <h3>{review.courseId.courseCode}</h3>
                  <h3>{review.professorId.professorName}</h3>
                  <p>{review.courseId.courseName}</p>
                  <p>
                    {review.semesterTaken.term} {review.semesterTaken.year}
                  </p>
                  <p>{review.userComment}</p>
                  <p>
                    Course Rating: {parseFloat(review.courseRating).toFixed(2)}
                  </p>
                  <p>
                    Professor Rating: {parseFloat(review.profRating).toFixed(2)}
                  </p>
                  <p>{convertDate(review.createdAt)}</p>
                </div>
              );
            })}
            <div className={styles.paginationContainer}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </div>
        </section>
      ) : (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      )}
    </main>
  );
};

export default Dashboard;
