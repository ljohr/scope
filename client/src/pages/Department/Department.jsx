// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./CourseSingle.css";

// const CourseSingle = () => {
//   const [dept, setDept] = useState([]);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const response = await axios.get("/:deptcode/");
//         setDept(response.data);
//       } catch (error) {
//         console.error("Error fetching courses", error);
//       }
//     };

//     fetchCourse();
//   }, []);
//   return (
//     <main className="course-single-main">
//       <h1>Course Single page</h1>
//       <li key={course._id}>
//         {course.courseCode} - {course.professorId.professorName}
//       </li>
//     </main>
//   );
// };

// export default CourseSingle;
