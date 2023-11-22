import { initializeApp, applicationDefault } from "firebase-admin/app";
import "dotenv/config";
require("dotenv").config();

const fbApp = initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://scope-a8a0d.firebaseio.com",
});

export { fbApp };
