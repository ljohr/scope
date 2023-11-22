import { useContext } from "react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";
import { UserContext } from "../../utils/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const logoutUser = async () => {
    try {
      await signOut(auth);
      await axios.post("/api/sessionLogOut", {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="nav-bar">
      <nav className="nav-links">
        <ul>
          <li>
            <Link to="/" className="nav-title">
              <span>Scope</span>
            </Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          <li>
            <Link to="/professors">Professors</Link>
          </li>
          <li>
            <Link to="/top-rated">Top Rated</Link>
          </li>
          <li>
            <Link to="/majors">Majors</Link>
          </li>
          <li>
            <Link to="/core">Core</Link>
          </li>
        </ul>
      </nav>
      <nav className="nav-search">
        <form>
          <input
            type="text"
            placeholder="Find a Review"
            className="search-bar"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </nav>
      <nav className="nav-login">
        <ul>
          {currentUser ? (
            <li>
              <button onClick={logoutUser}>Log Out</button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <button>Log in</button>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <button>Sign Up</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
