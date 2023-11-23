import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data);
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
  }, [navigate]);

  return (
    <main className="courses-container">
      <h1>Courses</h1>
      <section className="all-courses">
        {courses.map((course) => {
          console.log(course);
          return (
            <div key={course._id} className="course-single">
              <div className="course-info">
                <h4 className="course-title">{course.courseCode}</h4>
                <h4 className="course-title">{course.courseName}</h4>
                <p>{course.professorId.professorName}</p>
              </div>
              <a className="light-green-btn" href="">
                See All Reviews
              </a>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default Courses;
