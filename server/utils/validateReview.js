import Joi from "joi";

const reviewSchema = Joi.object({
  courseId: Joi.string().required(),
  professorId: Joi.string().required(),
  fbUid: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(2013)
    .max(new Date().getFullYear())
    .required(),
  term: Joi.string().required(),
  courseRating: Joi.number().min(0).max(5).required(),
  profRating: Joi.number().min(0).max(5).required(),
  courseworkHours: Joi.number().min(0).required(),
  userComment: Joi.string().required(),
  courseTags: Joi.array().items(Joi.string()).required(),
  profTags: Joi.array().items(Joi.string()).required(),
  reviewHeadline: Joi.string().max(255).required(),
  workload: Joi.string(),
  lecturerStyle: Joi.string(),
  gradingStyle: Joi.string(),
});

const validateReviewData = (data) => {
  const { error } = reviewSchema.validate(data);
  return error ? error.details.map((detail) => detail.message) : null;
};

export default validateReviewData;
