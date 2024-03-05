import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../providers/UserContext";
import "./LoginRegister.css";
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (ev) => {
    ev.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setCurrentUser(user);

      const idToken = await user.getIdToken(true);
      await axios.post(
        "/api/sessionLogin",
        {},
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      navigate("/"); // Redirect user after login
    } catch (error) {
      console.error(error);
      handleLoginError(error.code); // Handle login errors
    }
  };

  const handleLoginError = (errorCode) => {
    if (errorCode == "auth/too-many-requests") {
      toast.error(
        "Too many frequent login attempts. Try again in a few seconds."
      );
    } else {
      toast.error(
        "Login failed. Please check if this is the right email/password combination."
      );
    }
  };

  return (
    <main className="login-main">
      <div className="register-card">
        <h1>Login</h1>
        <form action="" className="login-form">
          <input
            type="email"
            placeholder="BC Email"
            onChange={(ev) => setEmail(ev.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(ev) => setPassword(ev.target.value)}
            autoComplete="current-password"
          />
          <button type="submit" onClick={loginUser}>
            Log In
          </button>
        </form>
        <Link to="/reset-password">Forgot your password?</Link>
        <p>
          {"Don't have an account?"} <a href="/register">Sign Up Here</a>
        </p>
      </div>
    </main>
  );
};

export default Login;
