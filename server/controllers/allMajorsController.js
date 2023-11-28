import admin from "firebase-admin";
import MajorModel from "../models/Majors.js";

const allMajorsController = async (req, res, next) => {
  const sessionCookie = req.cookies.userSession || "";
  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const majors = await MajorModel.find().sort({ code: 1 });
    res.json(majors);
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

export { allMajorsController };
