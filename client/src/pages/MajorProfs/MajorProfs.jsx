import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import toSlug from "../../utils/toSlug";
import "./MajorProfs.css";

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
    <div className="profs-container">
      <h1>Professors</h1>
      <section className="all-profs">
        {professors.map((prof) => {
          const coursesURL = `/${prof.department}/${toSlug(
            prof.professorName
          )}`;
          return (
            <div key={prof._id} className="profs-single">
              <div className="prof-info">
                <h4 className="prof-code">{prof.professorName}</h4>
                <p className="prof-name">{prof.department}</p>
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
  );
};

export default MajorProfs;
