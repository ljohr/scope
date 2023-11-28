import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const CourseSchema = new Schema({
  courseName: { type: String, index: true },
  courseCode: { type: String, index: true },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professor",
    index: true,
  },
  department: { type: String, index: true },
  avgCourseRating: { type: Number, default: null },
  totalCourseRatingSum: { type: Number, default: 0 },
  totalCourseReviewers: { type: Number, default: 0 },
  courseTags: {
    heavyWorkload: { type: Number, default: 0 },
    fairWorkload: { type: Number, default: 0 },
    lightWorkload: { type: Number, default: 0 },
    followsTextbook: { type: Number, default: 0 },
    participationHeavy: { type: Number, default: 0 },
    discussionBased: { type: Number, default: 0 },
    noFinalProject: { type: Number, default: 0 },
  },
  profTags: {
    greatLecturer: { type: Number, default: 0 },
    fairLecturer: { type: Number, default: 0 },
    confusingLecturer: { type: Number, default: 0 },
    lenientGrader: { type: Number, default: 0 },
    fairGrader: { type: Number, default: 0 },
    toughGrader: { type: Number, default: 0 },
    approachable: { type: Number, default: 0 },
    willingToHelp: { type: Number, default: 0 },
  },
  modality: String,
  isCore: { type: Boolean, default: false },
  majors: [
    {
      type: ObjectId,
      ref: "Major",
    },
  ],
  avgWeeklyHours: { type: Number, default: 0 },
  totalWeeklyHours: { type: Number, default: 0 },
  totalWeeklyHoursReviewers: { type: Number, default: 0 },
});

CourseSchema.index({ courseCode: 1, professorId: 1 }, { unique: true });

const CourseModel = mongoose.model("Course", CourseSchema);
export default CourseModel;
