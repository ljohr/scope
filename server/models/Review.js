import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      index: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    semesterTaken: {
      year: { type: Number },
      term: {
        type: String,
        enum: ["Spring", "Summer", "Fall"],
      },
    },
    courseRating: { type: Number, default: 0 },
    profRating: { type: Number, default: 0 },
    userComments: String,
    courseTags: {
      heavyWorkload: { type: Boolean, default: false },
      fairWorkload: { type: Boolean, default: false },
      lightWorkload: { type: Boolean, default: false },
      followsTextbook: { type: Boolean, default: false },
      participationHeavy: { type: Boolean, default: false },
      discussionBased: { type: Boolean, default: false },
      noFinalProject: { type: Boolean, default: false },
    },
    profTags: {
      greatLecturer: { type: Boolean, default: false },
      fairLecturer: { type: Boolean, default: false },
      confusingLecturer: { type: Boolean, default: false },
      lenientGrader: { type: Boolean, default: false },
      fairGrader: { type: Boolean, default: false },
      toughGrader: { type: Boolean, default: false },
      approachable: { type: Boolean, default: false },
      willingToHelp: { type: Boolean, default: false },
    },
    reviewHeadline: String,
    reviewers: Number,
    nonReviewers: Number,
    isCore: { type: Boolean, default: false },
    modality: String,
    endofSemesterRev: { type: Boolean, default: false },
    endofSemesterSection: Number,
    flagInappropriate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("Review", ReviewSchema);

export default ReviewModel;
