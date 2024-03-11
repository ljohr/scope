import mongoose from "mongoose";
import ProfessorModel from "../models/Professor.js";
import UserModel from "../models/User.js";
import ThankYouModel from "../models/ThankYou.js";

const { ObjectId } = mongoose.Types;

const createPost = async (reviewData, user) => {
  await ThankYouModel.create({
    professorId: reviewData.professorId,
    userId: user._id,
    pseudonym: reviewData.pseudonym,
    commentHeadline: reviewData.commentHeadline,
    userComment: reviewData.userComment,
  });
};

const newThanksController = async (reviewData) => {
  try {
    const professorId = new ObjectId(reviewData.professorId);
    const professor = await ProfessorModel.findById(professorId);
    if (!professor) {
      return { status: 404, message: "Professor not found" };
    }

    const user = await UserModel.findOne({ fbUserId: reviewData.fbUid });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const existingReviewCount = await ThankYouModel.countDocuments({
      userId: user._id,
      professorId: professorId,
    });

    if (existingReviewCount >= 1) {
      return {
        status: 400,
        message:
          "You have already left a thank you message for this professor!",
      };
    }

    await createPost(reviewData, user);
    return { status: 200, message: "Review submitted successfully" };
  } catch (error) {
    return { status: 500, message: "Error submitting review" };
  }
};

export default newThanksController;
