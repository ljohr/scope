import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import "./Majors.css";

const Majors = () => {
  const [majors, setMajors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await axios.get(
          `/api/majors?page=${page}&limit=${limit}`
        );
        setMajors(response.data.majors);
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

    fetchMajors();
  }, [navigate, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="majors-container">
      <h1>Majors</h1>
      <section className="all-majors">
        {majors.map((major) => {
          const profsURL = `/${major.code}/professors`;
          const coursesURL = `/${major.code}/all-courses`;
          return (
            <div key={major._id} className="major-single">
              <div className="major-info">
                <h4 className="major-code">{major.code}</h4>
                <p className="major-name">{major.name}</p>
              </div>
              <div className="major-links">
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
      <div className="pagination-container">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default Majors;
