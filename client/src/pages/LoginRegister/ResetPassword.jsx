import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { auth } from "../../config/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function resetPassword(ev) {
    ev.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast("Password rest email sent!");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Reset Password | Scope</title>
        </Helmet>
      </HelmetProvider>
      <main className="signup-main">
        <div className="register-card">
          <h1>Reset your password</h1>
          <p>Enter your Scope email account</p>
          <form action="" className="signup-form" onSubmit={resetPassword}>
            <input
              type="email"
              placeholder="BC Email"
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <button type="submit">Request Reset Email</button>
          </form>
          <p>
            <Link to="/login">Return to Login</Link>
          </p>
          <div>
            <ToastContainer />
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
