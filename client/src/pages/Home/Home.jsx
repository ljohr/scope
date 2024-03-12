import { Link, useNavigate } from "react-router-dom";
import StudentsTalking from "../../assets/students-talking.svg";
import "./Home.css";
import { useContext, useEffect } from "react";
import { UserContext } from "../../providers/UserContext";

const Home = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  });

  return (
    <main className="home-main">
      <Hero />
      <How />
      <Info />
    </main>
  );
};

const Hero = () => {
  return (
    <section className="hero">
      <div className="home-info">
        <h1>Course Evaluations for BC Students</h1>

        <h3 className="review-line">
          <span className="review-count"></span> Reviews and counting
        </h3>
        <div className="btn-container">
          <Link to="/register">
            <button>Join to Read Reviews</button>
          </Link>
        </div>
      </div>
      <div className="home-img">
        <img
          src={StudentsTalking}
          alt="students-students"
          className="talking-students"
        />
      </div>
    </section>
  );
};

const How = () => {
  return (
    <section className="how-to-use">
      <h1>How to Use</h1>
      <h3 className="review-line">
        <span className="review-count"></span>Reviews and counting
      </h3>
      <button>Join to Read Reviews</button>
      <div className="how-to-inner">
        <div>
          <p>Login with your BC email</p>
        </div>
        <div>
          <p>Find and add your own course reviews!</p>
        </div>
      </div>
    </section>
  );
};

const Info = () => {
  return (
    <section id="how-to-use">
      <h1>Where is this information coming from?</h1>
      <p>
        Past semester-end course evaluations and reviews from BC students were
        used to create this website.
      </p>
    </section>
  );
};

export default Home;
