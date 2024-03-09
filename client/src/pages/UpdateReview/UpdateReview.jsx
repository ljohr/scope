import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GetYears } from "../../utils/GetYears";
import { UserContext } from "../../providers/UserContext";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";
import Slider from "@mui/material/Slider";
import StarRating from "../UserReview/components/StarRating";
import TagSelection from "../UserReview/components/TagSelection";
import "./UpdateReview.css";

const UpdateReview = () => {
  const { currentUser } = useContext(UserContext);
  const { deptcode, profname, coursecode, reviewId } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});
  const [professor, setProfessor] = useState({});
  const [courseRating, setCourseRating] = useState(null);
  const [profRating, setProfRating] = useState(null);
  const [profTags, setProfTags] = useState({
    approachable: false,
    willingToHelp: false,
  });
  const [courseTags, setCourseTags] = useState({
    followsTextbook: false,
    participationHeavy: false,
    discussionBased: false,
    noFinalProject: false,
  });
  const [workload, setWorkload] = useState({
    heavyWorkload: false,
    fairWorkload: false,
    lightWorkload: false,
  });
  const [lecturerStyle, setLecturerStyle] = useState({
    greatLecturer: false,
    fairLecturer: false,
    confusingLecturer: false,
  });
  const [gradingStyle, setGradingStyle] = useState({
    lenientGrader: false,
    fairGrader: false,
    toughGrader: false,
  });
  const [reviewHeadline, setReviewHeadline] = useState("");
  const [userComment, setUserComment] = useState("");
  const [courseworkHours, setCourseworkHours] = useState(0);
  const [term, setTerm] = useState("Spring");
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;

    if (!profRating) {
      toast.error("Please rate the professor 1-5.");
      console.log("Validation failed");
      isValid = false;
    }
    if (!courseRating) {
      toast.error("Please rate the course 1-5.");
      console.log("Validation failed");
      isValid = false;
    }
    if (!workload) {
      toast.error("Please select a workload.");
      console.log("Validation failed");
      isValid = false;
    }
    if (!lecturerStyle) {
      toast.error("Please select a lecture style.");
      console.log("Validation failed");
      isValid = false;
    }
    if (!gradingStyle) {
      toast.error("Please select a grading style.");
      console.log("Validation failed");
      isValid = false;
    }
    if (courseworkHours == 0) {
      toast.error("Please select hours between 1-15.");
      console.log("Validation failed");
      isValid = false;
    }
    if (isValid) {
      try {
        const auth = getAuth();
        const idToken = await getIdToken(auth.currentUser);
        await axios.post(
          "/api/new-review",
          {
            professorId: professor.id,
            courseId: courseInfo._id,
            profRating,
            courseRating,
            profTags,
            courseTags,
            term,
            year,
            workload,
            lecturerStyle,
            gradingStyle,
            courseworkHours,
            reviewHeadline,
            userComment,
            fbUid: user.uid,
          },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        toast.success("Review submitted successfully!");
        navigate(`/${deptcode}/${profname}/${coursecode}`);
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error("Error submitting review.");
      }
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const validateUser = async () => {
      try {
        const res = await axios.get(`/api/validate-user-review/${reviewId}`);
        console.log(res.data);
        console.log(currentUser);
        if (res.data.fbUserId != currentUser.uid) {
          toast.error("You do not have permission to edit this review.");
          console.error("Error fetching review");
          return;
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error("You do not have permission to edit this review.");
      }
    };

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

    const fetchReviewData = async () => {
      try {
        const auth = getAuth();
        const idToken = await getIdToken(auth.currentUser);
        const res = await axios.get(`/api/fetch-review/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        console.log(res.data);
        // setProfRating(res.data.profRating);
        // setCourseRating(res.data.courseRating);
        // setTerm(res.data.semesterTaken[term]);
        // setYear(res.data.semesterTaken[year]);
        // setWorkload(res.data.workload);
        // // setLecturerStyle(res.data.lecturerStyle);
        // // setGradingStyle(res.data.gradingStyle);
        // setCourseTags(res.data.courseTags);
        // setProfTags(res.data.profTags);
        // // setCourseworkHours(res.data.courseworkHours);
        // setReviewHeadline(res.data.reviewHeadline);
        // setUserComment(res.data.userComment);
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error("You do not have permission to edit this review.");
      }
    };

    validateUser();
    fetchCourse();
    fetchReviewData();

    console.log("workload", workload);
  }, [deptcode, profname, coursecode, currentUser, reviewId]);

  return (
    <main className="user-review-main">
      {dataLoaded ? (
        <div className="main-container">
          <Link to={`/${deptcode}/${profname}/${coursecode}`}>
            <h1>
              {courseInfo.courseCode} - {courseInfo.courseName}
            </h1>
          </Link>
          <Link to={`/${deptcode}/${profname}`}>
            <h2>{professor.name}</h2>
          </Link>
          <div className="container">
            <section className="user-review">
              <h3>Submit Your Review</h3>
              <div className="rating-container">
                <h4>Overall Professor Rating</h4>
                <StarRating rating={profRating} setRating={setProfRating} />
              </div>
              <div className="rating-container">
                <h4>Overall Course Rating</h4>
                <StarRating rating={courseRating} setRating={setCourseRating} />
              </div>
              <div className="semester-container">
                <h4>Semester Taken</h4>
                <select
                  name="term"
                  id="termDropdown"
                  onChange={(e) => setTerm(e.target.value)}
                >
                  <option key="Spring" value="Spring">
                    Spring
                  </option>
                  <option key="Summer" value="Summer">
                    Summer
                  </option>
                  <option key="Fall" value="Fall">
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
                gradingStyle={gradingStyle}
                profTags={profTags}
                courseTags={courseTags}
                setWorkload={setWorkload}
                setLecturerStyle={setLecturerStyle}
                setGradingStyle={setGradingStyle}
                setCourseTags={setCourseTags}
                setProfTags={setProfTags}
              />
              <div className="weekly-hours">
                <h4>Hours per Week: {courseworkHours} hours</h4>
                <p>
                  Select the value that best estimates your weekly coursework
                  hours.
                </p>
                <Slider
                  aria-label="Temperature"
                  defaultValue={0}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={15}
                  onChange={(e) => setCourseworkHours(e.target.value)}
                />
              </div>
              <div className="headline-container">
                <h4>Review Headline</h4>
                <input
                  className="user-headline"
                  type="text"
                  placeholder="Set a title summarizing your experience"
                  onChange={(e) => setReviewHeadline(e.target.value)}
                />
              </div>
              <div className="comment-container">
                <h4>User Comment</h4>
                <textarea
                  className="user-comment"
                  name="user-comment"
                  rows="7"
                  placeholder="Describe your experience: key takeaways, teaching style, workload, and any tips for future students!"
                  onChange={(e) => setUserComment(e.target.value)}
                />
              </div>

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
                {professor.avgProfRating.toFixed(2)}
                <Rating
                  name="half-rating"
                  defaultValue={professor.avgProfRating}
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
              <div>
                {courseInfo.avgWeeklyHours == 0 ? (
                  ""
                ) : (
                  <>
                    <p>Average Coursework Hours</p>
                    <Slider
                      className="coursehours-avg-slider"
                      aria-label="Temperature"
                      valueLabelDisplay="on"
                      defaultValue={courseInfo.avgWeeklyHours}
                      step={1}
                      marks
                      min={0}
                      max={15}
                      disabled
                    />
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </main>
  );
};

export default UpdateReview;
