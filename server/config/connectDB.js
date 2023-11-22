import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
  } catch (err) {
    console.error("DB connection error: ", err);
    throw err;
  }
};

export default connectDB;
