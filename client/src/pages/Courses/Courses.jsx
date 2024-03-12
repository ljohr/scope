import axios from "axios";
import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Rating, Pagination, CircularProgress } from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast } from "react-toastify";

import toSlug from "../../utils/toSlug";
import MajorFilter from "../../components/MajorFilter/MajorFilter";

import styles from "./Courses.module.css";
import { UserContext } from "../../providers/UserContext";

const Courses = () => {
  const { currentUser, loading } = useContext(UserContext);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMajorCode, setSelectedMajorCode] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;
  const navigate = useNavigate();

  const fetchCourses = useCallback(async () => {
    try {
      const url = selectedMajorCode
        ? `/api/courses?major=${selectedMajorCode}&page=${page}&limit=${limit}`
        : `/api/courses/?page=${page}&limit=${limit}`;
      const response = await axios.get(url);
      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
      setDataLoaded(true);
    } catch (error) {
      if (error.status === 404) {
        console.log(error);
      } else if (error.status === 401) {
        toast.error("Please login to view this page!");
        navigate("/");
      }
    }
  }, [selectedMajorCode, page, limit, navigate]);

  const handleMajorSelect = useCallback((major) => {
    setSelectedMajorCode(major ? major.code : "");
    setPage(1);
  }, []);

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please login to view the page.");
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>All Courses | Scope</title>
        </Helmet>
      </HelmetProvider>
      <main className={styles.coursesContainer}>
        <h1>Courses</h1>
        {dataLoaded ? (
          <>
            <div className={styles.container}>
              <MajorFilter onMajorSelect={handleMajorSelect} />
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

export default Courses;
