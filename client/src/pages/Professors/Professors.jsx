import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import toSlug from "../../utils/toSlug";
import MajorFilter from "../../components/MajorFilter/MajorFilter";
import styles from "./Professors.module.css";

const Professors = () => {
  const [professors, setProfessors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axios.get(
          `/api/professors?page=${page}&limit=${limit}`
        );
        setProfessors(response.data.professors);
        console.log(response);
        console.log(professors);
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
  }, [navigate, page, professors]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className={styles.profsContainer}>
      <h1>Professors</h1>
      <div className={styles.container}>
        <MajorFilter />
        <section className={styles.allProfs}>
          {professors.map((prof) => {
            const coursesURL = `/${prof.department}/${toSlug(
              prof.professorName
            )}`;
            return (
              <div key={prof._id} className={styles.profsSingle}>
                <div className={styles.profInfo}>
                  <h4 className={styles.profCode}>{prof.professorName}</h4>
                  <p className={styles.profName}>{prof.department}</p>
                </div>
                <div className="major-links">
                  <Link className="light-green-btn" to={coursesURL}>
                    See All Course Reviews
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
        <div className="pagination-container">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Professors;
