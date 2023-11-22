import mongoose from "mongoose";
const { Schema } = mongoose;

const MajorSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const MajorModel = mongoose.model("Major", MajorSchema);
export default MajorModel;
