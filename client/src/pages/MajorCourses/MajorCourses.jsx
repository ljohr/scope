import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import "./MajorCourses.css";
import toSlug from "../../utils/toSlug";

const MajorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;
  const navigate = useNavigate();
  const { deptcode } = useParams();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `/api/${deptcode}/all-courses?page=${page}&limit=${limit}`
        );
        setCourses(response.data.courses);
        setTotalPages(Math.ceil(response.data.totalPages));
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
    <div className="profs-container">
      <h1>{deptcode.toUpperCase()} - All Courses</h1>
      <section className="all-profs">
        {courses.map((course) => {
          return (
            <div key={course._id} className="profs-single">
              <div className="prof-info">
                <h4 className="prof-code">{course.courseCode}</h4>
                <h4 className="prof-code">{course.courseName}</h4>
                <p className="prof-code">{course.professorId.professorName}</p>
              </div>
              <div className="major-links">
                <Link
                  className="light-green-btn"
                  to={`/${deptcode}/${toSlug(
                    course.professorId.professorName
                  )}/${course.courseCode}`}
                >
                  See All Course Reviews
                </Link>
              </div>
            </div>
          );
        })}
      </section>
      <div className="pagination-container">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default MajorCourses;
