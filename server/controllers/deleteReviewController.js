import mongoose from "mongoose";
import CourseModel from "../models/Course.js";
import ProfessorModel from "../models/Professor.js";
import ReviewModel from "../models/Review.js";

const { ObjectId } = mongoose.Types;

const updateTags = (originalTags, tagsToUpdate) => {
  Object.keys(originalTags).forEach((key) => {
    if (originalTags[key] && tagsToUpdate[key] > 0) {
      tagsToUpdate[key] -= 1;
    }
  });
};

const updateCourse = async (course, reviewData) => {
  // Get all professor tags
  updateTags(reviewData.profTags, course.profTags);
  updateTags(reviewData.lecturerStyle, course.profTags);
  updateTags(reviewData.gradingStyle, course.profTags);

  // Get all course tags
  updateTags(reviewData.courseTags, course.courseTags);
  updateTags(reviewData.workload, course.courseTags);

  course.totalCourseRatingSum -= reviewData.courseRating;
  course.totalCourseReviewers -= 1;
  course.avgCourseRating =
    course.totalCourseReviewers > 0
      ? course.totalCourseRatingSum / course.totalCourseReviewers
      : 0;

  course.totalWeeklyHours -= reviewData.courseworkHours;
  course.totalWeeklyHoursReviewers -= 1;
  course.avgWeeklyHours =
    course.totalWeeklyHoursReviewers > 0
      ? course.totalWeeklyHours / course.totalWeeklyHoursReviewers
      : 0;

  course.totalProfRatingSum -= reviewData.profRating;
  course.totalProfReviewers -= 1;
  course.avgProfRating =
    course.totalProfReviewers > 0
      ? course.totalProfRatingSum / course.totalProfReviewers
      : 0;

  await course.save();
};

const updateProfessor = async (professor, reviewData) => {
  // Get all professor tags
  updateTags(reviewData.profTags, professor.profTags);
  updateTags(reviewData.lecturerStyle, professor.profTags);
  updateTags(reviewData.gradingStyle, professor.profTags);

  // Get all professor course tags
  updateTags(reviewData.courseTags, professor.courseTags);
  updateTags(reviewData.workload, professor.courseTags);

  professor.totalProfRatingSum -= reviewData.profRating;
  professor.totalProfReviewers -= 1;
  professor.avgProfRating =
    professor.totalProfReviewers > 0
      ? professor.totalProfRatingSum / professor.totalProfReviewers
      : 0;

  await professor.save();
};

const deleteReviewController = async (reviewId) => {
  try {
    const originalReviewId = new ObjectId(reviewId);
    const reviewData = await ReviewModel.findById(originalReviewId);
    if (!reviewData) {
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

    await updateCourse(course, reviewData);
    await updateProfessor(professor, reviewData);
    await ReviewModel.findByIdAndDelete(originalReviewId);

    return { status: 200, message: "Successfully deleted review " };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Error deleting review" };
  }
};

export default deleteReviewController;
