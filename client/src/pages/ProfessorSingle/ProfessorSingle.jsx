import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress, Pagination } from "@mui/material";
import axios from "axios";
import "./ProfessorSingle.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

const ProfessorSingle = () => {
  const { deptcode, profname } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [professor, setProfessor] = useState({});
  const [courses, setCourses] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `/api/profSingle/${deptcode}/${profname}?&page=${page}&limit=${limit}`
        );
        setProfessor(response.data.professor);
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
        setDataLoaded(true);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 404) {
          navigate("/page-not-found");
        } else if (error.response && error.response.status === 401) {
          toast.error("Please login to view this page!");
          navigate("/");
        }
      }
    };

    fetchCourse();
  }, [deptcode, profname, page, navigate]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{professor.professorName || "Professor Info"} | Scope</title>
        </Helmet>
      </HelmetProvider>
      {dataLoaded ? (
        <main className="prof-single-main">
          <h1>{professor.professorName}</h1>
          <Link className="course-dept" to={`/${deptcode}/professors`}>
            {professor.department}
          </Link>
          <Link
            className="thank-you-page"
            to={`/${deptcode}/${profname}/thank-you`}
          >
            Leave a message to thank Professor {professor.professorName}
          </Link>
          <section className="prof-courses">
            {courses.map((course) => {
              const courseReviewUrl = `/${deptcode}/${profname}/${course.courseCode}`;
              return (
                <div key={course._id} className="prof-course">
                  <div className="prof-course-info">
                    <h4>
                      {course.courseCode} {course.courseName}
                    </h4>
                    <p>
                      Average Instructor Rating:{" "}
                      {course.avgProfRating.toFixed(2)}
                    </p>
                    <p>
                      Average Course Rating: {course.avgCourseRating.toFixed(2)}
                    </p>
                    <p>Total Reviewers: {course.totalCourseReviewers}</p>
                  </div>
                  <Link to={courseReviewUrl} className="see-all-btn">
                    See Course Reviews
                  </Link>
                </div>
              );
            })}
          </section>
          {totalPages > 1 ? (
            <div className="pagination-container">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          ) : (
            <></>
          )}
        </main>
      ) : (
        <div className="loading-container">
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default ProfessorSingle;
