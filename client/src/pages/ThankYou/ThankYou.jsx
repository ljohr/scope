import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { UserContext } from "../../providers/UserContext";
import convertDate from "../../utils/convertDate";

import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import styles from "./ThankYou.module.css";
import { Pagination } from "@mui/material";

const ThankYou = () => {
  const { currentUser } = useContext(UserContext);
  const { deptcode, profname } = useParams();
  const [curReviewUid, setCurReviewUid] = useState(null);
  const [postsData, setPostsData] = useState({
    posts: [],
    professor: {},
    reviews: [],
    totalPages: 0,
    dataLoaded: false,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 12;
  const navigate = useNavigate();

  const getPosts = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/thankYou/${deptcode}/${profname}?&page=${page}&limit=${limit}`
      );
      setPostsData({
        posts: res.data.posts,
        professor: res.data.professor,
        totalPages: res.data.totalPages,
        dataLoaded: true,
      });
    } catch (error) {
      console.error(error);
    }
  }, [deptcode, profname, page]);

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
    getPosts();

    if (currentUser) {
      fetchUserId();
    }
  }, [getPosts, fetchUserId, currentUser]);

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
      await axios.delete(`/api/thankYou/${selectedReviewId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      handleClose();
      setPostsData((prevData) => ({ ...prevData, dataLoaded: false }));
      await getPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Thank You Page for Professor{" "}
            {postsData.professor.professorName || ""} | Scope
          </title>
        </Helmet>
      </HelmetProvider>
      <main className={styles.thankYouContainer}>
        {postsData.dataLoaded ? (
          <>
            <h1>
              <Link className="add-review-btn" to={`/${deptcode}/${profname}/`}>
                {postsData.professor.professorName}
              </Link>{" "}
              - Thank You Page
            </h1>

            <h3>
              <Link className="add-review-btn" to={`/${deptcode}/professors`}>
                {deptcode}
              </Link>
            </h3>
            <Link
              className="add-review-btn"
              to={`/${deptcode}/${profname}/thank-you/new-post`}
            >
              <button className="review-btn">Leave a thank you note!</button>
            </Link>
            <div className={styles.postContainer}>
              {postsData.posts.length > 0 ? (
                postsData.posts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postSingle}>
                      <div className={styles.postHeader}>
                        <h4>{post.commentHeadline}</h4>
                        <p>{convertDate(post.createdAt)}</p>
                      </div>
                      <p></p>
                      <p>{post.userComment}</p>
                      <p className={styles.userTitle}>{post.pseudonym}</p>
                      <div className="change-btn-container">
                        {/* Check if the current user is the author of the review */}
                        {currentUser && post.userId === curReviewUid && (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() =>
                                navigate(
                                  `/${deptcode}/${profname}/thank-you/update-review/${post._id}`
                                )
                              }
                            >
                              Edit Review
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleClickOpen(post._id)}
                            >
                              Delete Review
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noPosts}>
                  <h4>No posts yet! Be the first to leave a message.</h4>
                </div>
              )}
            </div>
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
          </>
        ) : (
          <div className="loading-container">
            <CircularProgress />
          </div>
        )}
        {postsData.totalPages > 1 ? (
          <div className="pagination-container">
            <Pagination
              count={postsData.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        ) : (
          <></>
        )}
      </main>
    </>
  );
};

export default ThankYou;
