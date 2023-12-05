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
import MajorModel from "./models/Majors.js";
import "./models/Professor.js";
import connectDB from "./config/connectDB.js";
import serviceAccount from "./config/scopefb.js";

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);

initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://scope-a8a0d.firebaseio.com",
});

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.post("api/registerUser", async (req, res, next) => {});

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

// app.post("/sessionLogin", async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     res.status(401).send("Unauthorized");
//     return;
//   }

//   const idToken = authHeader.split("Bearer ")[1];

//   if (!req.body.csrfToken) {
//     res.status(400).send("CSRF token not found in request");
//     return;
//   }
//   const csrfToken = req.headers["x-csrf-token"];

//   if (csrfToken !== req.cookies.csrfToken) {
//     res.status(401).send("UNAUTHORIZED REQUEST!");
//     return;
//   }

//   // 5 Days
//   const expiresIn = 60 * 60 * 24 * 5 * 1000;

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const sessionCookie = await admin
//       .auth()
//       .createSessionCookie(idToken, { expiresIn });

//     const options = { maxAge: expiresIn, httpOnly: true, secure: true };
//     res.cookie("userSession", sessionCookie, options);

//     const email = decodedToken.email;
//     const fbUserId = decodedToken.uid;

//     let user = await UserModel.findOne({ fbUserId });

//     if (!user) {
//       user = await UserModel.create({
//         email,
//         fbUserId,
//       });
//       await user.save();
//     }
//     res.json({ message: "Registration successful", user });
//   } catch (error) {
//     // ERROR BERAKS SO MUST CHEK
//     console.log(error);

//     if (error.code && error.code.startsWith("auth/")) {
//       res.status(401).send(error.message);
//     } else {
//       next(error);
//     }
//   }
// });

app.get("/api/majors", async (req, res) => {
  const sessionCookie = req.cookies.userSession || "";

  try {
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    console.log(decodedClaims);

    // Fetch and serve the majors list
    try {
      const majors = await MajorModel.find().sort({ code: 1 });
      res.json(majors);
    } catch (error) {
      console.error("Error fetching majors", error);
      res.status(500).send("Error fetching courses");
    }
  } catch (err) {
    console.error(err);
    // For API, send a 401 Unauthorized response instead of redirect
    res.status(401).send("Unauthorized: Invalid session");
  }
});

app.post("/api/sessionLogOut", async (req, res) => {
  try {
    res.clearCookie("userSession");
    res.status(200).send("Successful Logout");
  } catch (err) {
    console.error(err);
    // For API, send a 401 Unauthorized response instead of redirect
    res.status(401).send("Unauthorized: Invalid session");
  }
});

// app.get("/courses", async (req, res) => {
//   try {
//     const courses = await CourseModel.find().populate("professorId");
//     res.json(courses);
//   } catch (error) {
//     res.status(500).send("Error fetching courses");
//   }
// });

// app.get("/:deptcode/:profname", async (req, res) => {
//   try {
//     const { deptcode, profname } = req.params;
//     console.log(deptcode, nameFromSlug(profname));
//     // Fetch the professor by name and department.
//     const professor = await ProfessorModel.findOne({
//       professorName: nameFromSlug(profname),
//       department: deptcode.toUpperCase(),
//     })
//       .populate("professorName")
//       .populate("courseIds");
//     if (!professor) {
//       return res.status(404).json({ message: "Professor not found" });
//     }

//     res.json(professor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
>>>>>>> parent of ea191b0 (Added coursework hours and started server logic for part)
// app.get("/api/:deptcode/:profname/:courseCode", async (req, res) => {
//   try {
//     const { deptcode, profname, courseCode } = req.params;
//     // use the simple react searchbar wit hthe json course data i get back
//     const professor = await ProfessorModel.findOne({
//       professorName: nameFromSlug(profname),
//       department: deptcode.toUpperCase(),
//     });
<<<<<<< HEAD
=======
app.get("/:deptcode/:profname", async (req, res) => {
  const sessionCookie = req.cookies.userSession || "";
  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const { deptcode, profname } = req.params;
    console.log(deptcode, nameFromSlug(profname));
    // Fetch the professor by name and department.
    const professor = await ProfessorModel.findOne({
      professorName: nameFromSlug(profname),
      department: deptcode.toUpperCase(),
    })
      .populate("professorName")
      .populate("courseIds");
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }
>>>>>>> Stashed changes
=======
>>>>>>> parent of ea191b0 (Added coursework hours and started server logic for part)

//     if (!professor) {
//       return res.status(404).json({ message: "Professor not found" });
//     } // Find the course by professorId, department, and courseCode

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
>>>>>>> parent of ea191b0 (Added coursework hours and started server logic for part)
//     console.log("deptcode", deptcode);
//     console.log("courseCode", courseCode);
//     // Add find by course to see all profs ani review page i nthe course page
//     const course = await CourseModel.findOne({
//       professorId: professor._id,
//       department: deptcode.toUpperCase(),
//       courseCode: courseCode.toUpperCase(),
//     });
<<<<<<< HEAD
=======
app.get("/api/:deptcode/:profname/:courseCode", async (req, res) => {
  const sessionCookie = req.cookies.userSession || "";
  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const { deptcode, profname, courseCode } = req.params;
    // use the simple react searchbar wit hthe json course data i get back
    const professor = await ProfessorModel.findOne({
      professorName: nameFromSlug(profname),
      department: deptcode.toUpperCase(),
    });
>>>>>>> Stashed changes
=======
>>>>>>> parent of ea191b0 (Added coursework hours and started server logic for part)

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     const reviews = await ReviewModel.find({ courseId: course._id }).sort({
//       createdAt: -1,
//     });

//     // Structure the response to include the course details and the reviews
//     const responseData = {
//       courseInfo: course,
//       professorDetails: {
//         id: professor._id,
//         name: professor.professorName,
//       },
//       reviews: reviews,
//     };

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
>>>>>>> parent of ea191b0 (Added coursework hours and started server logic for part)
//     res.json(responseData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
<<<<<<< HEAD
=======
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
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/new-review", async (req, res, next) => {
  const sessionCookie = req.cookies.userSession || "";
  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const reviewData = req.body;
    console.log(reviewData);
    res.status(200).send({ message: "Review submitted successfully" });
  } catch (error) {
    next(error);
  }
});
>>>>>>> Stashed changes
=======
>>>>>>> parent of ea191b0 (Added coursework hours and started server logic for part)

// eslint-disable-next-line
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
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
