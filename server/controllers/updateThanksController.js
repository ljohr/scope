import mongoose from "mongoose";
import ProfessorModel from "../models/Professor.js";
import ThankYouModel from "../models/ThankYou.js";

const { ObjectId } = mongoose.Types;

const updatePost = async (originalReview, reviewData) => {
  originalReview.professorId = reviewData.professorId;
  originalReview.pseudonym = reviewData.pseudonym;
  originalReview.commentHeadline = reviewData.commentHeadline;
  originalReview.userComment = reviewData.userComment;

  await originalReview.save();
};

const updateThanksController = async (reviewId, reviewData) => {
  try {
    const originalReviewId = new ObjectId(reviewId);
    const originalReview = await ThankYouModel.findById(originalReviewId);
    if (!originalReview) {
      console.log("???");
      return { status: 404, message: "Review not found" };
    }

    const professorId = new ObjectId(reviewData.professorId);
    const professor = await ProfessorModel.findById(professorId);
    if (!professor) {
      return { status: 404, message: "Professor not found" };
    }

    await updatePost(originalReview, reviewData);
    return { status: 200, message: "Review submitted successfully" };
  } catch (error) {
    return { status: 500, message: "Error submitting review" };
  }
};

export default updateThanksController;
