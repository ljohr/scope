import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";
import Slider from "@mui/material/Slider";
import "./CourseSingle.css";

const CourseSingle = () => {
  const { deptcode, profname, coursecode } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});
  const [professor, setProfessor] = useState({});
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `/api/${deptcode}/${profname}/${coursecode}`
        );
        setCourseInfo(res.data.courseInfo);
        setProfessor(res.data.professorDetails);
        setReviews(res.data.reviews);
        setDataLoaded(true);
      } catch (error) {
        toast.error("Please login to view this page!");
        navigate("/login");
      }
    };

    fetchCourse();
  }, [deptcode, profname, coursecode, navigate]);

  const courseHourAvg = [
    {
      value: courseInfo.avgWeeklyHours,
      label: courseInfo.avgWeeklyHours,
    },
  ];

  function valuetext() {
    return courseInfo.avgWeeklyHours;
  }

  return (
    <main className="course-single-main">
      {dataLoaded ? (
        <div className="main-container">
          <h1>
            {courseInfo.courseCode} - {courseInfo.courseName}
          </h1>
          <Link to={`/${deptcode}/${profname}`}>
            <h2>{professor.name}</h2>
          </Link>
          <Link
            className="add-review-btn"
            to={`/${deptcode}/${profname}/${coursecode}/new-review`}
          >
            <button className="review-btn">Add a Review!</button>
          </Link>
          <div className="container">
            <section className="course-reviews">
              {reviews.map((review) => {
                return (
                  <div key={review._id} className="review-card">
                    <div className="review-container">
                      <h4>{review.reviewHeadline}</h4>
                      <p>
                        {review.semesterTaken.term} {review.semesterTaken.year}
                      </p>
                    </div>
                    <div className="review-container">
                      {review.reviewers ? (
                        <p>
                          Reviewer Count: {review.reviewers}/
                          {review.nonReviewers}
                        </p>
                      ) : (
                        <></>
                      )}
                      {review.endofSemesterSection ? (
                        <p>Section {" " + review.endofSemesterSection}</p>
                      ) : (
                        <></>
                      )}
                    </div>
                    <p>
                      {review.modality != "Lecture" && review.modality != "N/A"
                        ? review.modality
                        : ""}
                    </p>
                    {/* {review.userComments ? ( */}
                    {review.userComment ? (
                      <p className="review-comment">{review.userComment}</p>
                    ) : (
                      <p>
                        Provided by students during end of semester evaluations.
                      </p>
                    )}
                    <div className="review-all-ratings">
                      <div className="prof-rating">
                        <p>Professor Rating: </p>
                        {review.profRating.toFixed(2)}
                        <Rating
                          name="half-rating"
                          defaultValue={review.profRating}
                          precision={0.1}
                          readOnly
                        />{" "}
                      </div>
                      <div className="course-rating">
                        <p>Course Rating: </p>
                        {review.courseRating.toFixed(2)}
                        <Rating
                          name="half-rating"
                          defaultValue={review.courseRating}
                          precision={0.1}
                          readOnly
                        />{" "}
                      </div>
                    </div>
                    {review.courseTags &&
                      Object.entries(review.courseTags).map(([key, value]) => {
                        return (
                          value && (
                            <div key={key} className="btn-pill">
                              {value}
                              {key}
                            </div>
                          )
                        );
                      })}
                  </div>
                );
              })}
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
              <div>
                {courseInfo.avgWeeklyHours == 0 ? (
                  ""
                ) : (
                  <>
                    <p className="coursework-title">Average Coursework Hours</p>
                    <Slider
                      className="coursehours-avg-slider"
                      aria-label="Hours"
                      defaultValue={courseInfo.avgWeeklyHours}
                      getAriaValueText={valuetext}
                      step={null}
                      min={0}
                      max={15}
                      valueLabelDisplay="auto"
                      marks={courseHourAvg}
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

export default CourseSingle;
