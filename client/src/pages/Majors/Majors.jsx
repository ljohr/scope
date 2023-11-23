import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./Majors.css";

const Majors = () => {
  const [majors, setMajors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await axios.get("/api/majors", {
          withCredentials: true,
        });
        setMajors(response.data);
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
  }, [navigate]);

  return (
    <div className="majors-container">
      <h1>Majors</h1>
      <section className="all-majors">
        {majors.map((major) => {
          const profsURL = `/${major.code}/professors`;
          const coursesURL = `/${major.code}/courses`;
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
    </div>
  );
};

export default Majors;
