import ReviewModel from "../models/Review.js";

const fetchUserReviews = async (userId, page, pageSize) => {
  const limit = pageSize;

  const reviews = await ReviewModel.find({
    userId: "65d4c6a7c2e2858bb04a0651",
  })
    .sort({ updatedAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit);
  console.log(reviews);
  return {
    reviews,
  };
};

export default fetchUserReviews;
