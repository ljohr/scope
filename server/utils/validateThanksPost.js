import Joi from "joi";

const reviewSchema = Joi.object({
  professorId: Joi.string().required(),
  fbUid: Joi.string().required(),
  pseudonym: Joi.string().required(),
  commentHeadline: Joi.string().required(),
  userComment: Joi.string().max(300).required(),
});

const validateThanksPost = (data) => {
  const { error } = reviewSchema.validate(data);
  return error ? error.details.map((detail) => detail.message) : null;
};

export default validateThanksPost;
