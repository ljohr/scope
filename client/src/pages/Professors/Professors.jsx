import { useState, useEffect, useCallback } from "react";
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
  const [selectedMajorCode, setSelectedMajorCode] = useState("");
  const limit = 12;
  const navigate = useNavigate();

  const fetchProfessors = useCallback(async () => {
    try {
      const url = selectedMajorCode
        ? `/api/professors?major=${selectedMajorCode}&page=${page}&limit=${limit}`
        : `/api/professors?page=${page}&limit=${limit}`;
      const response = await axios.get(url);
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
  }, [navigate, page, selectedMajorCode]);

  const handleMajorSelect = useCallback((major) => {
    setSelectedMajorCode(major ? major.code : "");
    setPage(1);
  }, []);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <main className={styles.profsContainer}>
      <h1>Professors</h1>
      <div className={styles.container}>
        <MajorFilter onMajorSelect={handleMajorSelect} />
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

export default Professors;
