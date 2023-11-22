import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const ProfessorSchema = new Schema({
  professorName: String,
  courseIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course", index: true },
  ],
  department: String,
  avgProfRating: Number,
  totalProfRatingSum: { type: Number, default: 0 },
  totalProfReviewers: { type: Number, default: 0 },
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
  majors: [
    {
      type: ObjectId,
      ref: "Major",
    },
  ],
});

const ProfessorModel = mongoose.model("Professor", ProfessorSchema);

export default ProfessorModel;
