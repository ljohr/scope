import mongoose from "mongoose";
import "dotenv/config";

const devConnectDB = async () => {
  try {
    await mongoose.connect(process.env.DEV_DB_URI);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection error: ", err);
    throw err;
  }
};

export default devConnectDB;
