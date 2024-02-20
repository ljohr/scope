import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Rating, Pagination } from "@mui/material";
import axios from "axios";
import toSlug from "../../utils/toSlug";
import styles from "./MajorProfs.module.css";

const MajorProfs = () => {
  const [professors, setProfessors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;
  const navigate = useNavigate();
  const { deptcode } = useParams();

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axios.get(
          `/api/${deptcode}/professors?page=${page}&limit=${limit}`
        );
        setProfessors(response.data.professors);
        setTotalPages(Math.ceil(response.data.totalPages));
      } catch (error) {
        if (error.status === 404) {
          console.log(error);
        } else if (error.status === 401) {
          toast.error("Please login to view this page!");
          navigate("/login");
        }
      }
    };

    fetchProfessors();
  }, [navigate, deptcode, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <main className={styles.profsContainer}>
      <h1>{deptcode.toUpperCase()} - All Professors</h1>
      <div className={styles.innerContainer}>
        <section className={styles.allProfs}>
          {professors.map((prof) => {
            const coursesURL = `/${prof.department}/${toSlug(
              prof.professorName
            )}`;
            return (
              <div key={prof._id}>
                <div className={styles.profsSingle}>
                  <div className={styles.profInfo}>
                    <h4 className={styles.profsDept}>{prof.department}</h4>
                    <h4 className={styles.profName}>{prof.professorName}</h4>

                    <div className={styles.ratingInfo}>
                      <p>{prof.avgProfRating.toFixed(2)}</p>
                      <Rating
                        name="half-rating"
                        value={parseFloat(prof.avgProfRating.toFixed(2))}
                        precision={0.1}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="major-links">
                    <Link className="light-green-btn" to={coursesURL}>
                      See All Course Reviews
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
      <div className={styles.paginationContainer}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </main>
  );
};

export default MajorProfs;
