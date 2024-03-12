import axios from "axios";
import { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { getAuth, getIdToken } from "firebase/auth";
import { toast } from "react-toastify";
import { UserContext } from "../../providers/UserContext";
import styles from "./EditThankYou.module.css";

const EditThankYou = () => {
  const { currentUser } = useContext(UserContext);
  const { deptcode, profname, reviewId } = useParams();
  const [professor, setProfessor] = useState({});
  const [pseudonym, setPseudonym] = useState("");
  const [commentHeadline, setCommentHeadline] = useState("");
  const [userComment, setUserComment] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const validateAndGetData = async () => {
      try {
        const res = await axios.get(
          `/api/thankYou/validateAndGetReview/${reviewId}`
        );
        if (res.data.fbUserId != currentUser.uid) {
          toast.error("You do not have permission to edit this review.");
          console.error("Error fetching review");
          return;
        } else {
          const reviewData = res.data.reviewData;
          setPseudonym(reviewData.pseudonym);
          setCommentHeadline(reviewData.commentHeadline);
          setUserComment(reviewData.userComment);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error("You do not have permission to edit this review.");
      }
    };
    const getProfessor = async () => {
      try {
        const response = await axios.get(
          `api/get-professor/${deptcode}/${profname}`
        );
        setProfessor(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    validateAndGetData();
    getProfessor();
  }, [deptcode, profname, currentUser, reviewId]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      let isValid = true;

      if (!pseudonym || pseudonym.length > 30 || pseudonym.length < 5) {
        toast.error("Please enter a pseudonym between 5-30 characters.");
        isValid = false;
      }

      if (
        !commentHeadline ||
        commentHeadline.length > 60 ||
        commentHeadline.length < 10
      ) {
        toast.error("Please enter a headline between 10-60 characters.");
        isValid = false;
      }

      if (!userComment || userComment.length > 300 || userComment.length < 10) {
        toast.error("Please enter a comment between 10-300 characters.");
        isValid = false;
      }
      if (isValid) {
        try {
          const auth = getAuth();
          const idToken = await getIdToken(auth.currentUser);
          await axios.put(
            `/api/thankYou/${deptcode}/${profname}/${reviewId}`,
            {
              professorId: professor._id,
              pseudonym,
              commentHeadline,
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
          navigate(`/${deptcode}/${profname}/thank-you`);
        } catch (error) {
          toast.error(error.response.data.message);
          console.log(error.response.status);
          if (error.response.status === 400) {
            navigate(`/${deptcode}/${profname}/thank-you`);
          }
          console.error("Error submitting review:", error);
        }
      }
    },
    [
      deptcode,
      profname,
      userComment,
      professor,
      user,
      commentHeadline,
      pseudonym,
      navigate,
      reviewId,
    ]
  );

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Edit Your Thank You Message | Scope</title>
        </Helmet>
      </HelmetProvider>
      <main className={styles.thankYouContainer}>
        <h1>Update Your Post to Thank Professor {professor.professorName}!</h1>
        <h3>
          <Link to={`/${deptcode}/${profname}/thank-you/`}>Thank You Page</Link>
        </h3>
        <div className={styles.formContainer}>
          <div className={styles.pseudonymContainer}>
            <h4>Add a Pseudonym</h4>
            <input
              className={styles.pseudonym}
              type="text"
              value={pseudonym ? pseudonym : ""}
              placeholder="Who's saying thank you? (Anonymous is fine)"
              onChange={(e) => setPseudonym(e.target.value)}
            />
          </div>
          <div className={styles.headlineContainer}>
            <h4>Thank You Note Headline</h4>
            <input
              className={styles.commentHeadline}
              type="text"
              placeholder="Short and sweet title for your note"
              value={commentHeadline ? commentHeadline : ""}
              onChange={(e) => setCommentHeadline(e.target.value)}
            />
          </div>
          <div className={styles.commentContainer}>
            <h4>User Note</h4>
            <textarea
              className={styles.userComment}
              name="user-comment"
              rows="5"
              value={userComment ? userComment : ""}
              placeholder={`Express your gratitude, mention memorable moments, or how this professor made a difference in your studies.`}
              onChange={(e) => setUserComment(e.target.value)}
            />
          </div>
          <div className={styles.submitContainer}>
            <button type="submit" onClick={handleSubmit}>
              Submit Note
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditThankYou;
