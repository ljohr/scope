import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./ThankYou.module.css";
import { useParams, Link } from "react-router-dom";

const ThankYou = () => {
  const { deptcode, profname } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [professor, setProfessor] = useState({});
  const [posts, setPosts] = useState([]);

  const getPosts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/thankYou/${deptcode}/${profname}`);
      setPosts(res.data.posts);
      setProfessor(res.data.professor);
      setDataLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }, [deptcode, profname]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const convertDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  };

  return (
    <main className={styles.thankYouContainer}>
      {dataLoaded ? (
        <>
          <h1>
            <Link className="add-review-btn" to={`/${deptcode}/${profname}/`}>
              {professor.professorName}
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
            {posts ? (
              posts.map((post, index) => {
                return (
                  <div key={post._id} className={styles.postSingle}>
                    <div className={styles.postHeader}>
                      <h4>Anonyous student {index + 1}</h4>
                      <p>{convertDate(post.createdAt)}</p>
                    </div>
                    <p>{post.userComment}</p>
                  </div>
                );
              })
            ) : (
              <h3>No posts yet</h3>
            )}
          </div>
        </>
      ) : (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      )}
    </main>
  );
};

export default ThankYou;
