import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GetYears } from "../../utils/GetYears";
import axios from "axios";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";
import StarRating from "./components/StarRating";
import TagSelection from "./components/TagSelection";
import "./UserReview.css";

const UserReview = () => {
  const { deptcode, profname, coursecode } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});
  const [professor, setProfessor] = useState({});
  const [courseRating, setCourseRating] = useState(1);
  const [profRating, setProfRating] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [term, setTerm] = useState("spring");
  const [year, setYear] = useState(new Date().getFullYear());
  const [workload, setWorkload] = useState("");
  const [lecturerStyle, setLecturerStyle] = useState("");
  const [grading, setGrading] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;

    if (!workload) {
      toast.error("Please select a workload.");
      console.log("Validation failed");
      isValid = false;
    }
    if (!lecturerStyle) {
      toast.error("Please select a lecturer style.");
      console.log("Validation failed");
      isValid = false;
    }
    if (!grading) {
      toast.error("Please select a grading style.");
      console.log("Validation failed");
      isValid = false;
    }
    if (isValid) {
      console.log("Validation success");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `/api/${deptcode}/${profname}/${coursecode}`
        );
        console.log(res.data);
        setCourseInfo(res.data.courseInfo);
        setProfessor(res.data.professorDetails);
        setDataLoaded(true);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 404) {
          // navigate("/page-not-found");
          console.log(error);
        } else if (error.response && error.response.status === 401) {
          toast.error("Please login to view this page!");
          navigate("/login");
        }
      }
    };

    fetchCourse();
  }, [deptcode, profname, coursecode, navigate]);

  return (
    <main className="user-review-main">
      {dataLoaded ? (
        <>
          <h1>
            {courseInfo.courseCode} - {courseInfo.courseName}
          </h1>
          <Link to={`/${deptcode}/${profname}`}>
            <h2>{professor.name}</h2>
          </Link>
          <div className="container">
            <section className="user-review">
              <h3>Submit Your Review</h3>
              <div className="rating-container">
                <h4>Overall Course Rating</h4>
                <StarRating rating={courseRating} setRating={setCourseRating} />
              </div>
              <div className="rating-container">
                <h4>Overall Professor Rating</h4>
                <StarRating rating={profRating} setRating={setProfRating} />
              </div>
              <div className="semester-container">
                <h4>Semester Taken</h4>
                <select
                  name="term"
                  id="termDropdown"
                  onChange={(e) => setTerm(e.target.value)}
                >
                  <option key="spring" value="spring">
                    Spring
                  </option>
                  <option key="summer" value="summer">
                    Summer
                  </option>
                  <option key="fall" value="fall">
                    Fall
                  </option>
                </select>
                <select
                  name="year"
                  id="yearDropdown"
                  onChange={(e) => setYear(e.target.value)}
                >
                  <GetYears />
                </select>
              </div>
              <TagSelection
                workload={workload}
                lecturerStyle={lecturerStyle}
                grading={grading}
                selectedTags={selectedTags}
                setWorkload={setWorkload}
                setLecturerStyle={setLecturerStyle}
                setGrading={setGrading}
                setSelectedTags={setSelectedTags}
              />
              <textarea
                className="user-comment"
                name="user-comment"
                rows="7"
                placeholder="Describe your experience: key takeaways, teaching style, workload, and any tips for future students. Help your peers pick the best courses!"
              />
              <div className="submit-container">
                <button type="submit" onClick={handleSubmit}>
                  Submit Review
                </button>
              </div>
            </section>
            <section className="course-overall">
              <h3>Course Overall</h3>
              <p>Average Professor Rating:</p>
              <div className="prof-rating">
                {courseInfo.avgProfRating.toFixed(2)}
                <Rating
                  name="half-rating"
                  defaultValue={courseInfo.avgProfRating}
                  precision={0.1}
                  readOnly
                />
              </div>
              <p>Average Course Rating: </p>
              <div className="prof-rating">
                {courseInfo.avgCourseRating.toFixed(2)}
                <Rating
                  name="half-rating"
                  defaultValue={courseInfo.avgCourseRating}
                  precision={0.1}
                  readOnly
                />
              </div>
              <p>
                Total Course Reviewers: <br /> {courseInfo.totalCourseReviewers}
              </p>
              <div className="allTags">
                <p>Course Tags:</p>
                <div className="courseTags">
                  {Object.entries(courseInfo.courseTags)
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, value]) => {
                      return (
                        <div key={key} className="btn-pill">
                          {key + " "}
                          {value}
                        </div>
                      );
                    })}
                </div>
                <p>Professor Tags:</p>
                <div className="courseTags">
                  {Object.entries(courseInfo.profTags)
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, value]) => {
                      return (
                        <div key={key} className="btn-pill">
                          {key + " "}
                          {value}
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          </div>
        </>
      ) : (
        <CircularProgress />
      )}
    </main>
  );
};

export default UserReview;
