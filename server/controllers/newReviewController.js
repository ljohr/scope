import admin from "firebase-admin";
import CourseModel from "../models/Course.js";
import ProfessorModel from "../models/Professor.js";
import ReviewModel from "../models/Review.js";
import UserModel from "../models/User.js";
import validateAuthHeader from "../utils/validateAuthHeader.js";

// need to refactor to simplify
// user.profTags[tag] = true; this is kind of sus

const createReviewDoc = async (reviewData, user) => {
  const newReview = await ReviewModel.create({
    professorId: reviewData.professorId,
    courseId: reviewData.courseId,
    userId: user._id,
    semesterTaken: {
      year: reviewData.year,
      term: reviewData.term,
    },
    courseRating: reviewData.courseRating,
    profRating: reviewData.profRating,
    courseworkHours: reviewData.courseworkHours,
    reviewHeadline: reviewData.reviewHeadline,
    userComment: reviewData.userComment,
  });
  await user.save();
  return newReview;
};
// ???
const updateCourse = async (course, reviewData, newReview) => {
  reviewData.courseTags = [...reviewData.courseTags, reviewData.workload];

  reviewData.profTags.forEach((tag) => {
    if (Object.prototype.hasOwnProperty.call(course.profTags, tag)) {
      course.profTags[tag] += 1;
    }

    if (Object.prototype.hasOwnProperty.call(newReview.profTags, tag)) {
      newReview.profTags[tag] = true;
    }
  });

  // Update Course Tags in Course Document
  reviewData.courseTags.forEach((tag) => {
    if (Object.prototype.hasOwnProperty.call(course.courseTags, tag)) {
      course.courseTags[tag] += 1;
    }
    if (Object.prototype.hasOwnProperty.call(newReview.courseTags, tag)) {
      newReview.profTags[tag] = true;
    }
  });

  // Update Ratings
  course.totalCourseRatingSum += reviewData.courseRating;
  course.totalCourseReviewers += 1;
  course.avgCourseRating =
    course.totalCourseRatingSum / course.totalCourseReviewers;

  if (course.weeklyHours == null) {
    course.weeklyHours = reviewData.courseworkHours;
  } else {
    course.weeklyHours += reviewData.courseworkHours;
  }

  course.totalWeeklyHours += reviewData.courseworkHours;
  course.totalWeeklyHoursReviewers += 1;
  course.avgWeeklyHours =
    course.totalWeeklyHours / course.totalWeeklyHoursReviewers;

  course.totalProfRatingSum += reviewData.profRating;
  course.totalProfReviewers += 1;
  course.avgProfRating = course.totalProfRatingSum / course.totalProfReviewers;

  await course.save();
};

const updateProfessor = async (professor, reviewData, newReview) => {
  reviewData.profTags = [
    ...reviewData.profTags,
    reviewData.lecturerStyle,
    reviewData.gradingStyle,
  ];

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

  // Update Ratings
  professor.totalProfRatingSum += reviewData.profRating;
  professor.totalProfReviewers += 1;
  professor.avgProfRating =
    professor.totalProfRatingSum / professor.totalProfReviewers;
  await professor.save();
};

const newReviewController = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.userSession || "";
    await validateAuthHeader(req.headers.authorization);
    await admin.auth().verifySessionCookie(sessionCookie, true);
    const reviewData = req.body;
    // const professorId = new ObjectId(reviewData.professorId);
    // const courseId = new ObjectId(reviewData.courseId);
    // const professor = await ProfessorModel.findById(professorId);
    const professor = await ProfessorModel.findById(reviewData.professorId);
    if (!professor) {
      console.error("Professor not found");
      return;
    }

    const course = await CourseModel.findById(reviewData.courseId);
    if (!course) {
      console.error("Course not found");
      return;
    }

    const user = await UserModel.findOne({ fbUserId: reviewData.fbUid });
    console.log("uid", reviewData.fbUid);
    const newReview = await createReviewDoc(reviewData, user);
    await updateCourse(course, reviewData, newReview);
    await updateProfessor(professor, reviewData, newReview);

    res.status(200).send({ message: "Review submitted successfully" });
  } catch (error) {
    next(error);
  }
};

export { newReviewController };
