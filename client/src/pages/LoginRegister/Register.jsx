import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast } from "react-toastify";

import { auth } from "../../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { validatePassword, checkMismatch } from "../../utils/validatePassword";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@bc\.edu$/;
    return regex.test(email);
  };

  const passwordCheck = (passwordResult) => {
    switch (passwordResult) {
      case "passedCheck":
        setPasswordError("");
        return true;
      case "tooShort":
        setPasswordError("⚠️ The password should be at least 8 characters");
        return false;
      case "tooLong":
        setPasswordError("⚠️ The password should be less than 30 characters");
        return false;
      case "onlyLower":
        setPasswordError(
          "⚠️ The password should have at least one uppercase letter"
        );
        return false;
      case "onlyUpper":
        setPasswordError(
          "⚠️ The password should have at least one lowercase letter"
        );
        return false;
      case "noSpecialChar":
        setPasswordError(
          "⚠️ The password should have at least one special character"
        );
        return false;
      default:
        return false;
    }
  };

  const checkEmailError = () => {
    if (!isValidEmail(email)) {
      setEmailError("⚠️ You must use an @bc.edu email");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const checkConfirmError = () => {
    if (!checkMismatch(password, confirm)) {
      setConfirmError("⚠️ The passwords do not match");
      return false;
    } else {
      setConfirmError("");
      return true;
    }
  };

  const registerUser = async (ev) => {
    ev.preventDefault();

    checkEmailError();
    if (emailError) {
      return;
    }
    checkConfirmError();
    if (confirmError) {
      return;
    }

    const passwordResult = validatePassword(password);
    if (!passwordCheck(passwordResult)) {
      return;
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        navigate("/dashboard");
        toast.success("A verification email has been sent to your inbox!");
      } catch (error) {
        const errorCode = error.code;
        switch (errorCode) {
          case "auth/email-already-in-use":
            toast.error("Email already exists!");
            break;
        }
      }
    }
  };

  const handlePasswordBlur = () => {
    const result = validatePassword(password);
    passwordCheck(result);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Register | Scope</title>
        </Helmet>
      </HelmetProvider>
      <main className="signup-main">
        <div className="register-card">
          <h1>Register</h1>
          <p>
            Create a strong password with at least one uppercase letter, one
            lowercase letter, and one special character.
          </p>
          <form action="" className="signup-form" onSubmit={registerUser}>
            <input
              type="email"
              value={email}
              placeholder="BC Email"
              className={emailError ? "email-error" : ""}
              onChange={(ev) => setEmail(ev.target.value)}
              onBlur={checkEmailError}
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              className={passwordError ? "password-error" : ""}
              onChange={(ev) => setPassword(ev.target.value)}
              onBlur={handlePasswordBlur}
            />
            <input
              type="password"
              value={confirm}
              placeholder="Confirm"
              className={confirmError ? "password-error" : ""}
              onChange={(ev) => setConfirm(ev.target.value)}
              onBlur={(ev) => checkConfirmError(password, ev.target.value)}
            />
            {emailError && <p className="error-msg">{emailError}</p>}
            {confirmError && <p className="error-msg">{confirmError}</p>}
            {passwordError && <p className="error-msg">{passwordError}</p>}
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already a member? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Register;
