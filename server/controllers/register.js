import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig.js";

const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const uid = user.uid;
  return { uid };
};

export { registerUser };
