import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.config.js";

const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const uid = user.uid;
  return { uid };
};

export { loginUser };
