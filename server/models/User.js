import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true },
    fbUserId: { type: String, unique: true },
    gradYear: {
      type: Number,
      default: 2010,
    },
    major: [String],
    avgRatingByYear: [
      {
        year: Number,
        rating: Number,
      },
    ],
    totalCoursesRated: {
      type: Number,
      default: 0,
    },
    coursesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
