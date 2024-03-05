import Joi from "joi";

const reviewSchema = Joi.object({
  courseId: Joi.string().required(),
  professorId: Joi.string().required(),
  userId: Joi.string().required(),
  semesterTaken: Joi.object({
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
    term: Joi.string().required(),
  }).required(),
  courseRating: Joi.number().min(0).max(5).required(),
  profRating: Joi.number().min(0).max(5).required(),
  courseworkHours: Joi.number().min(0).required(),
  userComment: Joi.string().required(),
  courseTags: Joi.array().items(Joi.string()).required(),
  profTags: Joi.array().items(Joi.string()).required(),
  reviewHeadline: Joi.string().max(255).required(),
});

const validateReviewData = (data) => {
  const { error } = reviewSchema.validate(data);
  return error ? error.details.map((detail) => detail.message) : null;
};

export default validateReviewData;
