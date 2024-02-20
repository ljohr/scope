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
    courseworkHours: { type: Number, default: null },
    userComment: { type: String, default: null },
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
    reviewHeadline: { type: String, default: null },
    reviewers: { type: Number, default: null },
    nonReviewers: { type: Number, default: null },
    isCore: { type: Boolean, default: false },
    modality: { type: String, default: null },
    endofSemesterRev: { type: Boolean, default: false },
    endofSemesterSection: Number,
    flagInappropriate: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: false, updatedAt: false } }
);

const ReviewModel = mongoose.model("Review", ReviewSchema);

export default ReviewModel;
