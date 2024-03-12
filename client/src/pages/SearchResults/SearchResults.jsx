import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Rating, Pagination, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import toSlug from "../../utils/toSlug";
import axios from "axios";
import styles from "./SearchResults.module.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;
  const [results, setResults] = useState([]);
  const query = useQuery();
  const searchQuery = query.get("query");
  const type = query.get("type");

  useEffect(() => {
    setPage(1);
  }, [searchQuery, type]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (type == "Professor") {
          const response = await axios.get(
            `/search/profSearch/${searchQuery}/?page=${page}&limit=${limit}`
          );
          setResults(response.data.results);
          setTotalPages(response.data.totalPages);
          setDataLoaded(true);
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
    <>
      <HelmetProvider>
        <Helmet>
          <title>Search Results | Scope</title>
        </Helmet>
      </HelmetProvider>
      <main className={styles.resultsMain}>
        <h1>{type} Search Results</h1>
        <h3>
          Results for <span className={styles.queryText}>{searchQuery}</span>
        </h3>
        <>
          {dataLoaded ? (
            <>
              <div className={styles.container}>
                <section className={styles.allResults}>
                  {results.map((result, index) => {
                    if (type === "Course") {
                      return (
                        <div key={index} className={styles.resultSingle}>
                          <div className={styles.resultInfo}>
                            <h4 className={styles.resultTitle}>
                              {result.courseCode}
                            </h4>
                            <h4 className={styles.resultTitle}>
                              {result.courseName}
                            </h4>
                            <p>{result.professorName}</p>
                          </div>
                          <div className={styles.ratingInfo}>
                            <p>
                              {(
                                result.totalCourseRatingSum /
                                result.totalProfReviewers
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
                            <p>
                              Average Instructor Rating:{" "}
                              {result.avgProfRating.toFixed(2)}
                            </p>
                            <p>Total Reviewers: {result.totalProfReviewers}</p>
                          </div>
                          <Rating
                            name="half-rating"
                            value={parseFloat(result.avgProfRating || 0)}
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
                {results.length === 0 && (
                  <div className={styles.noResultContainer}>
                    <p>
                      Did you mean to search for a{" "}
                      {type === "Course" ? "professor" : "course"}? You have
                      searched for a {type.toLowerCase()}.
                    </p>
                  </div>
                )}
              </div>
              {results.length > 0 && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </div>
              )}
            </>
          ) : (
            <div className={styles.loadingContainer}>
              <CircularProgress />
            </div>
          )}
        </>
      </main>
    </>
  );
};

export default SearchResults;
