import axios from "axios";
import { useEffect, useState, useCallback } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import convertDate from "../../utils/convertDate.js";
import toSlug from "../../utils/toSlug.js";
import { Link } from "react-router-dom";

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
        totalPages > 0 ? (
          <section className={styles.userReviews}>
            <h2>Recent Reviews</h2>
            <div className={styles.reviewsContainer}>
              {reviews.map((review, index) => {
                return (
                  <div key={index} className={styles.reviewSingle}>
                    <Link
                      to={`/${review.courseId.department}/${toSlug(
                        review.professorId.professorName
                      )}/${review.courseId.courseCode}`}
                    >
                      <h3 className={styles.reviewCourseTitle}>
                        {review.courseId.courseCode} /{" "}
                        {review.professorId.professorName}
                      </h3>
                    </Link>
                    <div className={styles.containerRow}>
                      <h3 className={styles.courseName}>
                        {review.courseId.courseName}
                      </h3>
                      <p className={styles.termTaken}>
                        {review.semesterTaken.term} {review.semesterTaken.year}
                      </p>
                    </div>
                    <p className={styles.userComment}>{review.userComment}</p>
                    <div className={styles.ratingContainer}>
                      <div className={styles.ratingInfo}>
                        <p>Course Rating: </p>
                        <Rating
                          name="half-rating"
                          value={parseFloat(review.courseRating)}
                          precision={0.1}
                          readOnly
                        />
                      </div>
                      <div className={styles.ratingInfo}>
                        <p>Professor Rating: </p>
                        <Rating
                          name="half-rating"
                          value={parseFloat(review.profRating)}
                          precision={0.1}
                          readOnly
                        />
                      </div>
                    </div>
                    <p className={styles.createdDate}>
                      Posted {convertDate(review.createdAt)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="pagination-container">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </section>
        ) : (
          <></>
        )
      ) : (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      )}
    </main>
  );
};

export default Dashboard;
