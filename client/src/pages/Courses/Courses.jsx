import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { toast } from "react-toastify";
import axios from "axios";
import toSlug from "../../utils/toSlug";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `/api/courses/?page=${page}&limit=${limit}`
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
  }, [navigate, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <main className="courses-container">
      <h1>Courses</h1>
      <section className="all-courses">
        {courses.map((course) => {
          return (
            <div key={course._id} className="course-single">
              <div className="course-info">
                <h4 className="course-title">{course.courseCode}</h4>
                <h4 className="course-title">{course.courseName}</h4>
                <p>{course.professorId.professorName}</p>
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
      <div className="pagination-container">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </main>
  );
};

export default Courses;
