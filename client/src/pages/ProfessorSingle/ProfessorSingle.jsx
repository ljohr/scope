import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./ProfessorSingle.css";

// const nameToSlug = (name) => {
//   return name.toLowerCase().split(" ").join("-");
// };

const ProfessorSingle = () => {
  const { deptcode, profname } = useParams();
  const [professor, setProfessor] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/${deptcode}/${profname}`);
        setProfessor(response.data);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 404) {
          navigate("/page-not-found");
          console.log("hi?");
          console.log(error);
        } else if (error.response && error.response.status === 401) {
          toast.error("Please login to view this page!");
          navigate("/login");
        }
      }
    };

    fetchCourse();
  }, [deptcode, profname, navigate]);

  return (
    <main className="prof-single-main">
      <h1>{professor.professorName}</h1>
      <h3 className="course-dept">{professor.department}</h3>
      <section className="prof-courses">
        {professor.courseIds?.map((course) => {
          const courseReviewUrl = `/${deptcode}/${profname}/${course.courseCode}`;
          return (
            <div key={course._id} className="prof-course">
              <div className="prof-course-info">
                {/* sort by course code */}
                <h4>
                  {course.courseCode}: {course.courseName}
                </h4>
                <p>Average Instructor Rating: {course.avgProfRating}</p>
                <p>Average Course Rating: {course.avgCourseRating}</p>
                <p>Total Reviewers: {course.totalProfReviewers}</p>
              </div>
              <Link to={courseReviewUrl} className="see-all-btn">
                See Course Reviews
              </Link>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default ProfessorSingle;
