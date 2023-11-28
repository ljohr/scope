import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../utils/UserContext";
import "./LoginRegister.css";
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = (ev) => {
    ev.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setCurrentUser(user);
        navigate("/");
        user
          .getIdToken(true)
          .then((idToken) => {
            axios.post(
              "/api/sessionLogin",
              {},
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            );
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        switch (errorCode) {
          case "auth/user-not-found":
            toast.error("User does not exist!");
            break;
          case "auth/invalid-login-credentials":
            toast.error("Incorrect Password!");
            break;
          case "auth/too-many-requests":
            toast.error(
              "Too many frequent login attempts. Try gain in a few seconds."
            );
            break;
        }
      });
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
