import mongoose from "mongoose";
import ThankYouModel from "../models/ThankYou.js";

const { ObjectId } = mongoose.Types;

const deleteThankYouController = async (reviewId) => {
  try {
    const originalReviewId = new ObjectId(reviewId);
    const reviewData = await ThankYouModel.findById(originalReviewId);
    if (!reviewData) {
      return { status: 404, message: "Review not found" };
    }

    await ThankYouModel.findByIdAndDelete(originalReviewId);

    return { status: 200, message: "Successfully deleted review " };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Error deleting review" };
  }
};

export default deleteThankYouController;
