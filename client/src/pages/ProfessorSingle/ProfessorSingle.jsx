import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import "./ProfessorSingle.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

const ProfessorSingle = () => {
  const { deptcode, profname } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [professor, setProfessor] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/${deptcode}/${profname}`);
        const sortedCourses = response.data.courseIds.sort((a, b) =>
          a.courseCode.localeCompare(b.courseCode)
        );
        setProfessor({
          ...response.data,
          courseIds: sortedCourses,
        });
        setDataLoaded(true);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 404) {
          navigate("/page-not-found");
        } else if (error.response && error.response.status === 401) {
          toast.error("Please login to view this page!");
          navigate("/login");
        }
      }
    };

    fetchCourse();
  }, [deptcode, profname, navigate]);

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
            className="course-dept"
            to={`/${deptcode}/${profname}/thank-you`}
          >
            Thank You Page
          </Link>
          <section className="prof-courses">
            {professor.courseIds?.map((course) => {
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
        </main>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ProfessorSingle;
