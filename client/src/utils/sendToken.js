import axios from "axios";
import { auth } from "../config/firebaseConfig";

function sendTokentoServer() {
  auth.currentUser
    .getIdToken(true)
    .then((idToken) => {
      // Send token to your backend via HTTPS
      // ...
    })
    .catch((error) => {
      // Handle error
    });
}

export { sendTokentoServer };
