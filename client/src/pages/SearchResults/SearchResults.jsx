import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Rating, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import toSlug from "../../utils/toSlug";
import axios from "axios";
import styles from "./SearchResults.module.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;
  const [results, setResults] = useState([]);
  const query = useQuery();
  const searchQuery = query.get("query");
  const type = query.get("type");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (type == "Professor") {
          const response = await axios.get(
            `/search/profSearch/${searchQuery}/?page=${page}&limit=${limit}`
          );
          setResults(response.data.results);
          setTotalPages(response.data.totalPages);
        } else if (type == "Course") {
          const response = await axios.get(
            `/search/courseSearch/${searchQuery}/?page=${page}&limit=${limit}`
          );
          setResults(response.data.results);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      }
    };

    fetchResults();
  }, [searchQuery, type, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <main className={styles.resultsMain}>
      <div className={styles.container}>
        <h2>Search Results</h2>
        <section className={styles.allResults}>
          {results.map((result, index) => {
            if (type === "Course") {
              return (
                <div key={index}>
                  <div className={styles.courseInfo}>
                    <h4 className={styles.courseTitle}>{result.courseCode}</h4>
                    <h4 className={styles.courseTitle}>{result.courseName}</h4>
                    <p>{result.professorName}</p>
                  </div>
                  <div className={styles.ratingInfo}>
                    <p>
                      {(
                        result.totalCourseRatingSum / result.totalProfReviewers
                      ).toFixed(2)}
                    </p>
                    <Rating
                      name="half-rating"
                      value={parseFloat(
                        (
                          result.totalCourseRatingSum /
                            result.totalProfReviewers || 0
                        ).toFixed(2)
                      )}
                      precision={0.1}
                      readOnly
                    />
                  </div>
                  <Link
                    className="light-green-btn"
                    to={`/${result.department}/${toSlug(
                      result.professorName
                    )}/${result.courseCode}`}
                  >
                    See All Reviews
                  </Link>
                </div>
              );
            } else if (type === "Professor") {
              return (
                <div key={index} className={styles.resultSingle}>
                  <div className="prof-course-info">
                    <div className={styles.resultInfo}>
                      <h4 className={styles.resultTitle}>
                        {result.department}
                      </h4>
                      <h4 className={styles.resultTitle}>
                        {result.courseName}
                      </h4>
                      <p>{result.professorName}</p>
                    </div>
                    <p>Average Instructor Rating: {result.avgProfRating}</p>
                    <p>Total Reviewers: {result.totalProfReviewers}</p>
                  </div>
                  <Rating
                    name="half-rating"
                    value={parseFloat((result.avgProfRating || 0).toFixed(2))}
                    precision={0.1}
                    readOnly
                  />
                  <Link
                    to={`/${result.department}/${toSlug(
                      result.professorName
                    )}/`}
                    className="see-all-btn"
                  >
                    See Course Reviews
                  </Link>
                </div>
              );
            }
          })}
        </section>
        <div className={styles.paginationContainer}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
    </main>
  );
};

export default SearchResults;
