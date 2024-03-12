import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Pagination, CircularProgress } from "@mui/material";
import MajorFilter from "../../components/MajorFilter/MajorFilter";

import styles from "./Majors.module.css";

const Majors = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [majors, setMajors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMajorCode, setSelectedMajorCode] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;
  const navigate = useNavigate();

  const fetchMajors = useCallback(async () => {
    try {
      const url = selectedMajorCode
        ? `/api/majors?major=${selectedMajorCode}&page=${page}&limit=${limit}`
        : `/api/majors?page=${page}&limit=${limit}`;
      const response = await axios.get(url);
      setMajors(response.data.majors);
      setTotalPages(response.data.totalPages);
      setDataLoaded(true);
    } catch (error) {
      if (error.status === 404) {
        console.log(error);
      } else if (error.status === 401) {
        toast.error("Please login to view this page!");
        navigate("/login");
      }
    }
  }, [selectedMajorCode, page, limit, navigate]);

  const handleMajorSelect = useCallback((major) => {
    console.log(major.code);
    setSelectedMajorCode(major ? major.code : "");
    setPage(1);
  }, []);

  useEffect(() => {
    fetchMajors();
  }, [fetchMajors]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <main className={styles.majorsContainer}>
      <h1>Majors</h1>
      {dataLoaded ? (
        <>
          <div className={styles.container}>
            <MajorFilter onMajorSelect={handleMajorSelect} />

            <section className={styles.allMajors}>
              {majors.map((major) => {
                const profsURL = `/${major.code}/professors`;
                const coursesURL = `/${major.code}/all-courses`;
                return (
                  <div key={major._id} className={styles.majorSingle}>
                    <div className={styles.majorInfo}>
                      <h4 className={styles.majorCode}>{major.code}</h4>
                      <p className={styles.majorName}>{major.name}</p>
                    </div>
                    <div className={styles.majorLinks}>
                      <Link className="light-green-btn" to={profsURL}>
                        See All Professors
                      </Link>
                      <Link className="light-green-btn" to={coursesURL}>
                        See All Courses
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
        </>
      ) : (
        <div className="loading-container">
          <CircularProgress />
        </div>
      )}
    </main>
  );
};

export default Majors;
