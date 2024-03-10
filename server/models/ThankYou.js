import mongoose from "mongoose";
const { Schema } = mongoose;

const ThankYouSchema = new Schema(
  {
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    pseudonym: { type: String, default: null },
    commentHeadline: { type: String, default: null },
    userComment: { type: String, default: null },
  },
  { timestamps: true }
);

const ThankYouModel = mongoose.model("ThankYou", ThankYouSchema);
export default ThankYouModel;
