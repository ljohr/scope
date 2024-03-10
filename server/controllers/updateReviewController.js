import mongoose from "mongoose";
import CourseModel from "../models/Course.js";
import ProfessorModel from "../models/Professor.js";
import ReviewModel from "../models/Review.js";
import UserModel from "../models/User.js";

const { ObjectId } = mongoose.Types;

const updateTags = (newTags, tagsToUpdate, originalTags) => {
  console.log("****************************");
  console.log(newTags, tagsToUpdate, originalTags);
  Object.keys(newTags).forEach((key) => {
    if (originalTags[key] && !newTags[key]) {
      tagsToUpdate[key] -= 1;
    }
    if (!originalTags[key] && newTags[key]) {
      tagsToUpdate[key] += 1;
    }
  });
};

const updateReviewDoc = async (review, reviewData) => {
  review.professorId = reviewData.professorId;
  review.courseId = reviewData.courseId;
  review.semesterTaken.year = reviewData.year;
  review.semesterTaken.term = reviewData.term;
  review.workload = reviewData.workload;
  review.courseRating = reviewData.courseRating;
  review.profRating = reviewData.profRating;
  review.lecturerStyle = reviewData.lecturerStyle;
  review.gradingStyle = reviewData.gradingStyle;
  review.courseworkHours = reviewData.courseworkHours;
  review.reviewHeadline = reviewData.reviewHeadline;
  review.userComment = reviewData.userComment;
  review.courseTags = reviewData.courseTags;
  review.profTags = reviewData.profTags;
  await review.save();
};

const updateCourse = async (course, reviewData, originalReview) => {
  // Get all professor tags
  updateTags(reviewData.profTags, course.profTags, originalReview.profTags);
  updateTags(
    reviewData.lecturerStyle,
    course.profTags,
    originalReview.lecturerStyle
  );
  updateTags(
    reviewData.gradingStyle,
    course.profTags,
    originalReview.gradingStyle
  );

  // Get all course tags
  updateTags(
    reviewData.courseTags,
    course.courseTags,
    originalReview.courseTags
  );
  updateTags(reviewData.workload, course.courseTags, originalReview.workload);

  course.totalCourseRatingSum -= originalReview.courseRating;
  course.totalCourseRatingSum += reviewData.courseRating;
  course.avgCourseRating =
    course.totalCourseRatingSum / course.totalCourseReviewers;

  course.totalWeeklyHours -= originalReview.courseworkHours;
  course.totalWeeklyHours += reviewData.courseworkHours;
  course.avgWeeklyHours =
    course.totalWeeklyHours / course.totalWeeklyHoursReviewers;

  course.totalProfRatingSum -= originalReview.profRating;
  course.totalProfRatingSum += reviewData.profRating;
  course.avgProfRating = course.totalProfRatingSum / course.totalProfReviewers;

  await course.save();
};

const updateProfessor = async (professor, reviewData, originalReview) => {
  // Get all professor tags
  updateTags(reviewData.profTags, professor.profTags, originalReview.profTags);
  updateTags(
    reviewData.lecturerStyle,
    professor.profTags,
    originalReview.lecturerStyle
  );
  updateTags(
    reviewData.gradingStyle,
    professor.profTags,
    originalReview.gradingStyle
  );

  // Get all professor course tags
  updateTags(
    reviewData.courseTags,
    professor.courseTags,
    originalReview.courseTags
  );
  updateTags(
    reviewData.workload,
    professor.courseTags,
    originalReview.workload
  );

  professor.totalProfRatingSum -= originalReview.profRating;
  professor.totalProfRatingSum += reviewData.profRating;
  professor.avgProfRating =
    professor.totalProfRatingSum / professor.totalProfReviewers;
  await professor.save();
};

const updateReviewController = async (reviewId, reviewData) => {
  try {
    const originalReviewId = new ObjectId(reviewId);
    const originalReview = await ReviewModel.findById(originalReviewId);
    if (!originalReview) {
      return { status: 404, message: "Review not found" };
    }

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

    await updateCourse(course, reviewData, originalReview);
    await updateProfessor(professor, reviewData, originalReview);
    await updateReviewDoc(originalReview, reviewData);
    return { status: 200, message: "Review submitted successfully" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Error submitting review" };
  }
};

export default updateReviewController;
