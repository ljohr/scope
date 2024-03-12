import axios from "axios";
import { useState, useEffect, useContext, useCallback } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { UserContext } from "../../providers/UserContext";
import convertDate from "../../utils/convertDate";

import { CircularProgress, Slider, Pagination } from "@mui/material";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./CourseSingle.css";

const CourseSingle = () => {
  const { currentUser } = useContext(UserContext);
  const { deptcode, profname, coursecode } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});
  const [professor, setProfessor] = useState({});
  const [reviews, setReviews] = useState([]);
  const [curReviewUid, setCurReviewUid] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;

  const navigate = useNavigate();

  const fetchCourse = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/courseSingle/${deptcode}/${profname}/${coursecode}?&page=${page}&limit=${limit}`
      );
      setCourseInfo(res.data.courseInfo);
      setProfessor(res.data.professorDetails);
      setReviews(res.data.reviews);
      setTotalPages(res.data.totalPages);
      setDataLoaded(true);
    } catch (error) {
      toast.error("Please login to view this page!");
      navigate("/login");
    }
  }, [deptcode, profname, coursecode, page, navigate]);

  const fetchUserId = useCallback(async () => {
    try {
      const idToken = await currentUser.getIdToken(true);
      const response = await axios.get("/api/userId", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setCurReviewUid(response.data.userId);
    } catch (error) {
      console.error("Failed to fetch user ID:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCourse();

    if (currentUser) {
      fetchUserId();
    }
  }, [currentUser, fetchCourse, fetchUserId]);

  const courseHourAvg = [
    {
      value: courseInfo.avgWeeklyHours,
      label: courseInfo.avgWeeklyHours,
    },
  ];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const valuetext = () => {
    return courseInfo.avgWeeklyHours;
  };

  const handleClickOpen = (reviewId) => {
    setOpenDialog(true);
    setSelectedReviewId(reviewId);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedReviewId(null);
  };

  const handleDelete = async () => {
    try {
      const idToken = await currentUser.getIdToken(true);
      await axios.delete(`/api/reviews/${selectedReviewId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            {courseInfo.courseCode || "Course Code"} |{" "}
            {professor.name || "Professor"} | Scope
          </title>
        </Helmet>
      </HelmetProvider>
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
                        <div>
                          <p>
                            {review.semesterTaken.term}{" "}
                            {review.semesterTaken.year}
                          </p>
                        </div>
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
                        {review.modality != "Lecture" &&
                        review.modality != "N/A"
                          ? review.modality
                          : ""}
                      </p>
                      {review.userComment ? (
                        <p className="review-comment">{review.userComment}</p>
                      ) : (
                        <p>
                          Provided by students during end of semester
                          evaluations.
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
                          />
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
                      <div className="user-tags">
                        {review.courseTags &&
                          Object.entries(review.courseTags).map(
                            ([key, value]) => {
                              return (
                                value && (
                                  <div key={key} className="btn-pill">
                                    {value}
                                    {key}
                                  </div>
                                )
                              );
                            }
                          )}
                      </div>
                      <div className="dateCreated">
                        <p>Posted {convertDate(review.createdAt)}</p>
                      </div>
                      <div className="change-btn-container">
                        {/* Check if the current user is the author of the review */}
                        {currentUser && review.userId === curReviewUid && (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() =>
                                navigate(
                                  `/${deptcode}/${profname}/${coursecode}/update-review/${review._id}`
                                )
                              }
                            >
                              Edit Review
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleClickOpen(review._id)}
                            >
                              Delete Review
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>

              <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this review?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleDelete} color="primary" autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
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
                  Total Course Reviewers: <br />{" "}
                  {courseInfo.totalCourseReviewers}
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
                      <p className="coursework-title">
                        Average Coursework Hours
                      </p>
                      <Slider
                        className="coursehours-avg-slider"
                        aria-label="Hours"
                        defaultValue={courseInfo.avgWeeklyHours}
                        getAriaValueText={valuetext}
                        step={null}
                        min={0}
                        max={15}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => value.toFixed(2)}
                        marks={courseHourAvg}
                        disabled
                      />
                    </>
                  )}
                </div>
              </section>
            </div>
            {totalPages > 1 ? (
              <div className="pagination-container">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="loading-container">
            <CircularProgress />
          </div>
        )}
      </main>
    </>
  );
};

export default CourseSingle;
