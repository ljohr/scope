import mongoose from "mongoose";
import CourseModel from "../models/Course.js";
import ProfessorModel from "../models/Professor.js";
import ReviewModel from "../models/Review.js";
import UserModel from "../models/User.js";

const { ObjectId } = mongoose.Types;

const updateTags = (newTags, tagsToUpdate) => {
  Object.keys(newTags).forEach((key) => {
    if (newTags[key]) {
      tagsToUpdate[key] += 1;
    }
  });
};

const createReviewDoc = async (reviewData, user) => {
  const newReview = await ReviewModel.create({
    professorId: reviewData.professorId,
    courseId: reviewData.courseId,
    userId: user._id,
    semesterTaken: {
      year: reviewData.year,
      term: reviewData.term,
    },
    workload: reviewData.workload,
    courseRating: reviewData.courseRating,
    profRating: reviewData.profRating,
    lecturerStyle: reviewData.lecturerStyle,
    gradingStyle: reviewData.gradingStyle,
    courseworkHours: reviewData.courseworkHours,
    reviewHeadline: reviewData.reviewHeadline,
    userComment: reviewData.userComment,
    courseTags: reviewData.courseTags,
    profTags: reviewData.profTags,
  });

  user.totalCoursesRated += 1;

  await user.save();

  return newReview;
};

const updateCourse = async (course, reviewData) => {
  updateTags(reviewData.profTags, course.profTags);
  updateTags(reviewData.courseTags, course.courseTags);

  course.totalCourseRatingSum += reviewData.courseRating;
  course.totalCourseReviewers += 1;
  course.avgCourseRating =
    course.totalCourseRatingSum / course.totalCourseReviewers;

  course.totalWeeklyHours += reviewData.courseworkHours;
  course.totalWeeklyHoursReviewers += 1;
  course.avgWeeklyHours =
    course.totalWeeklyHours / course.totalWeeklyHoursReviewers;

  course.totalProfRatingSum += reviewData.profRating;
  course.totalProfReviewers += 1;
  course.avgProfRating = course.totalProfRatingSum / course.totalProfReviewers;

  await course.save();
};

const updateProfessor = async (professor, reviewData) => {
  updateTags(reviewData.profTags, professor.profTags);
  updateTags(reviewData.courseTags, professor.courseTags);

  professor.totalProfRatingSum += reviewData.profRating;
  professor.totalProfReviewers += 1;
  professor.avgProfRating =
    professor.totalProfRatingSum / professor.totalProfReviewers;
  await professor.save();
};

const newReviewController = async (reviewData) => {
  try {
    const professorId = new ObjectId(reviewData.professorId);
    const professor = await ProfessorModel.findById(professorId);
    if (!professor) {
      return { status: 404, message: "Professor not found" };
    }

    const courseId = new ObjectId(reviewData.courseId);
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return { status: 404, message: "Course not found" };
    }

    const user = await UserModel.findOne({ fbUserId: reviewData.fbUid });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const newReview = await createReviewDoc(reviewData, user);
    await updateCourse(course, reviewData, newReview);
    await updateProfessor(professor, reviewData, newReview);
    return { status: 200, message: "Review submitted successfully" };
  } catch (error) {
    return { status: 500, message: "Error submitting review" };
  }
};

export { newReviewController };
