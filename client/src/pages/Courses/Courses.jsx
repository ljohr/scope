import { useState, useEffect } from "react";
import axios from "axios";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/courses"); // Your Express server URL
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);

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
