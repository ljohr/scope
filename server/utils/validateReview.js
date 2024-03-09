import Joi from "joi";

const reviewSchema = Joi.object({
  professorId: Joi.string().required(),
  courseId: Joi.string().required(),
  fbUid: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(2013)
    .max(new Date().getFullYear())
    .required(),
  term: Joi.string().required(),
  courseRating: Joi.number().min(0.5).max(5).required(),
  profRating: Joi.number().min(0.5).max(5).required(),
  userComment: Joi.string().max(300).required(),
  reviewHeadline: Joi.string().max(60).required(),
  courseworkHours: Joi.number().min(1).max(15).required(),
  profTags: Joi.object().pattern(/.*/, [Joi.boolean(), Joi.boolean()]),
  courseTags: Joi.object().pattern(/.*/, [
    Joi.boolean(),
    Joi.boolean(),
    Joi.boolean(),
    Joi.boolean(),
  ]),
  workload: Joi.object().pattern(/.*/, [
    Joi.boolean(),
    Joi.boolean(),
    Joi.boolean(),
  ]),
  lecturerStyle: Joi.object().pattern(/.*/, [
    Joi.boolean(),
    Joi.boolean(),
    Joi.boolean(),
  ]),
  gradingStyle: Joi.object().pattern(/.*/, [
    Joi.boolean(),
    Joi.boolean(),
    Joi.boolean(),
  ]),
});

const validateReviewData = (data) => {
  const { error } = reviewSchema.validate(data);
  return error ? error.details.map((detail) => detail.message) : null;
};

export default validateReviewData;
