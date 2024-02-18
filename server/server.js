import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import "dotenv/config";
import UserModel from "./models/User.js";
import CourseModel from "./models/Course.js";
import ReviewModel from "./models/Review.js";
import ProfessorModel from "./models/Professor.js";
import "./models/Professor.js";
import connectDB from "./config/connectDB.js";
import serviceAccount from "./config/scopefb.js";
// import mongoose from "mongoose";
import loginRouter from "./routers/loginRouter.js";
import logoutRouter from "./routers/logoutRouter.js";
import allMajorsRouter from "./routers/allMajorsRouter.js";
import newReviewRouter from "./routers/newReviewRouter.js";
import MajorModel from "./models/Majors.js";
// const { ObjectId } = mongoose.Types;
import profSearch from "./profSearch.js";
import courseSearch from "./courseSearch.js";

// sort prof page and courses by
// last semester taught -> alphabetical

const PORT = process.env.PORT || 4000;
const app = express();
app.use(helmet());

const nameFromSlug = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// const nameToSlug = (name) => {
//   return name.toLowerCase().split(" ").join("-");
// };

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// });

// app.use(limiter);

initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "http://localhost:5173",
});

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Set up user login / logout
// app.use(loginRouter);
app.use(logoutRouter);
// app.use(allMajorsRouter);

app.use(newReviewRouter);

app.post("/api/sessionLogin", async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  // 5 Days
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };
    const email = decodedToken.email;
    const fbUserId = decodedToken.uid;
    let user = await UserModel.findOne({ fbUserId });

    if (!user) {
      user = await UserModel.create({
        email,
        fbUserId,
      });
      await user.save();
    }

    res.cookie("userSession", sessionCookie, options);
    res.json({ message: "Registration successful", user });
  } catch (error) {
    console.log(error);
    if (error.code && error.code.startsWith("auth/")) {
      res.status(401).send(error.message);
    } else {
      next(error);
    }
  }
});

app.get("/api/majors", async (req, res, next) => {
  const sessionCookie = req.cookies.userSession || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const majorCode = req.query.major;
  console.log(majorCode);
  try {
    let query = {};
    if (majorCode) {
      query = { code: majorCode.toUpperCase() };
    }
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const majors = await MajorModel.find(query)
      .sort({ code: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalDocs = await MajorModel.countDocuments(query);
    console.log(majors);
    res.json({
      majors,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/courses", async (req, res, next) => {
  const sessionCookie = req.cookies.userSession || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const majorCode = req.query.major;
  try {
    let query = {};
    if (majorCode) {
      query = { department: majorCode.toUpperCase() };
    }
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const courses = await CourseModel.find(query)
      .sort({ courseCode: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("professorId");
    const totalDocs = await CourseModel.countDocuments(query);
    console.log(totalDocs);
    res.json({
      courses,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/:deptcode/professors", async (req, res, next) => {
  const sessionCookie = req.cookies.userSession || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const deptcode = req.params.deptcode.toUpperCase();
  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const professors = await ProfessorModel.find({ department: deptcode })
      .sort({ professorName: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalDocs = await ProfessorModel.countDocuments({
      department: deptcode,
    });
    res.json({
      professors,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/:deptcode/all-courses", async (req, res, next) => {
  const sessionCookie = req.cookies.userSession || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const deptcode = req.params.deptcode.toUpperCase();
  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const courses = await CourseModel.find({ department: deptcode })
      .sort({ courseCode: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("professorId");
    const totalDocs = await CourseModel.countDocuments({
      department: deptcode,
    });
    res.json({
      courses,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/professors", async (req, res, next) => {
  const sessionCookie = req.cookies.userSession || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const majorCode = req.query.major;
  try {
    let query = {};
    if (majorCode) {
      query = { department: majorCode.toUpperCase() };
    }
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const professors = await ProfessorModel.find(query)
      .sort({ professorName: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalDocs = await ProfessorModel.countDocuments(query);
    res.json({
      professors,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

// app.get("/api/courses", async (req, res, next) => {
//   const sessionCookie = req.cookies.userSession || "";
//   try {
//     await admin.auth().verifySessionCookie(sessionCookie, true);
//     const courses = await CourseModel.find().populate("professorId");
//     res.json(courses);
//   } catch (error) {
//     next(error);
//   }
// });

app.get("/:deptcode/:profname", async (req, res, next) => {
  // const sessionCookie = req.cookies.userSession || "";
  try {
    // await admin.auth().verifySessionCookie(sessionCookie, true);
    const { deptcode, profname } = req.params;
    // Fetch the professor by name and department.
    const professor = await ProfessorModel.findOne({
      professorName: nameFromSlug(profname),
      department: deptcode.toUpperCase(),
    })
      .populate("professorName")
      .populate("courseIds")
      .populate("avgProfRating");
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    res.json(professor);
  } catch (error) {
    next(error);
  }
});

app.get("/api/:deptcode/:profname/:courseCode", async (req, res, next) => {
  // const sessionCookie = req.cookies.userSession || "";
  try {
    // await admin.auth().verifySessionCookie(sessionCookie, true);
    const { deptcode, profname, courseCode } = req.params;
    // use the simple react searchbar wit hthe json course data i get back
    const professor = await ProfessorModel.findOne({
      professorName: nameFromSlug(profname),
      department: deptcode.toUpperCase(),
    });

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    } // Find the course by professorId, department, and courseCode

    // Add find by course to see all profs ani review page i nthe course page
    const course = await CourseModel.findOne({
      professorId: professor._id,
      department: deptcode.toUpperCase(),
      courseCode: courseCode.toUpperCase(),
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await ReviewModel.find({ courseId: course._id }).sort({
      createdAt: -1,
    });

    // Structure the response to include the course details and the reviews
    const responseData = {
      courseInfo: course,
      professorDetails: {
        id: professor._id,
        name: professor.professorName,
        avgProfRating: professor.avgProfRating,
      },
      reviews: reviews,
    };

    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

app.post("/api/new-review", async (req, res, next) => {
  // const sessionCookie = req.cookies.userSession || "";
  try {
    // await admin.auth().verifySessionCookie(sessionCookie, true);
    const reviewData = req.body;
    // const professorId = new ObjectId(reviewData.professorId);
    // const courseId = new ObjectId(reviewData.courseId);
    // const professor = await ProfessorModel.findById(professorId);
    const professor = await ProfessorModel.findById("656633b7e847102035e11294");
    if (!professor) {
      console.error("Professor not found");
      return;
    }

    const course = await CourseModel.findById("656388cce21362c48f7a2c51");
    if (!course) {
      console.error("Course not found");
      return;
    }

    reviewData.profTags = [
      ...reviewData.profTags,
      reviewData.lecturerStyle,
      reviewData.gradingStyle,
    ];

    reviewData.courseTags = [...reviewData.courseTags, reviewData.workload];

    // Update Professor Tags in Professor Document
    reviewData.profTags.forEach((tag) => {
      if (Object.prototype.hasOwnProperty.call(professor.profTags, tag)) {
        professor.profTags[tag] += 1;
      }
    });

    // Update Course Tags in Professor Document
    reviewData.courseTags.forEach((tag) => {
      if (Object.prototype.hasOwnProperty.call(professor.courseTags, tag)) {
        professor.courseTags[tag] += 1;
      }
    });

    // Update Professor Tags in Course Document
    reviewData.profTags.forEach((tag) => {
      if (Object.prototype.hasOwnProperty.call(course.profTags, tag)) {
        course.profTags[tag] += 1;
      }
    });

    // Update Course Tags in Course Document
    reviewData.courseTags.forEach((tag) => {
      if (Object.prototype.hasOwnProperty.call(course.courseTags, tag)) {
        course.courseTags[tag] += 1;
      }
    });

    course.totalCourseRatingSum += reviewData.courseRating;
    course.totalCourseReviewers += 1;
    course.avgCourseRating =
      course.totalCourseRatingSum / course.totalCourseReviewers;

    course.totalProfRatingSum += reviewData.profRating;
    course.totalProfReviewers += 1;
    course.avgProfRating =
      course.totalProfRatingSum / course.totalProfReviewers;

    course.totalWeeklyHours += course.courseworkHours;
    course.totalWeeklyHoursReviewers += 1;
    course.avgWeeklyHours =
      course.totalWeeklyHours / course.totalWeeklyHoursReviewers;

    // Update the Professor ratings
    professor.totalProfRatingSum += reviewData.profRating;
    professor.totalProfReviewers += 1;
    professor.avgProfRating =
      professor.totalProfRatingSum / professor.totalProfReviewers;

    await professor.save();
    await course.save();

    console.log("professor", professor);
    console.log(reviewData);
    res.status(200).send({ message: "Review submitted successfully" });
  } catch (error) {
    next(error);
  }
});

app.get("/search/profSearch/:searchQuery", async (req, res, next) => {
  const searchQuery = req.params.searchQuery;
  const allProfs = await profSearch(searchQuery);
  res.json(allProfs);
});

app.get("/search/courseSearch/:searchQuery", async (req, res, next) => {
  const searchQuery = req.params.searchQuery;
  const allCourses = await courseSearch(searchQuery);
  res.json(allCourses);
});

// eslint-disable-next-line
app.use((error, req, res, next) => {
  if (error.code === "auth/argument-error") {
    res.status(401).send("Unauthorized: Invalid session");
  } else {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
}

startServer();
