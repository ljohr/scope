import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast } from "react-toastify";

import { Rating, Pagination, CircularProgress } from "@mui/material";

import toSlug from "../../utils/toSlug";

import styles from "./MajorCourses.module.css";

const MajorCourses = () => {
  const { deptcode } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `/api/${deptcode}/all-courses?page=${page}&limit=${limit}`
        );
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
        setDataLoaded(true);
      } catch (error) {
        if (error.status === 404) {
          console.log(error);
        } else if (error.status === 401) {
          toast.error("Please login to view this page!");
          navigate("/login");
        }
      }
    };

    fetchCourses();
  }, [navigate, deptcode, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{deptcode.toUpperCase() || ""} - All Courses | Scope</title>
        </Helmet>
      </HelmetProvider>
      <main className={styles.coursesContainer}>
        <h1>{deptcode.toUpperCase()} - All Courses</h1>
        {dataLoaded ? (
          <>
            <div className={styles.container}>
              <section className={styles.allCourses}>
                {courses.map((course) => {
                  return (
                    <div key={course._id} className={styles.courseSingle}>
                      <div className={styles.courseInfo}>
                        <h4 className={styles.courseTitle}>
                          {course.courseCode}
                        </h4>
                        <h4 className={styles.courseTitle}>
                          {course.courseName}
                        </h4>
                        <p>{course.professorId.professorName}</p>
                      </div>
                      <div className={styles.ratingInfo}>
                        <p>
                          {(
                            course.totalCourseRatingSum /
                            course.totalProfReviewers
                          ).toFixed(2)}
                        </p>
                        <Rating
                          name="half-rating"
                          value={parseFloat(
                            (
                              course.totalCourseRatingSum /
                                course.totalProfReviewers || 0
                            ).toFixed(2)
                          )}
                          precision={0.1}
                          readOnly
                        />
                      </div>
                      <Link
                        className="light-green-btn"
                        to={`/${course.department}/${toSlug(
                          course.professorId.professorName
                        )}/${course.courseCode}`}
                      >
                        See All Reviews
                      </Link>
                    </div>
                  );
                })}
              </section>
            </div>
            <div className={styles.paginationContainer}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </>
        ) : (
          <div className="loading-container">
            <CircularProgress />
          </div>
        )}
      </main>
    </>
  );
};

export default MajorCourses;
