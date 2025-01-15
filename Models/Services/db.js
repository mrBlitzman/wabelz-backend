import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Wabelz",
    });
    console.log("MongoDB connection successful.");
  } catch (e) {
    console.log("MongoDB connection failed.");
    console.error(e);
  }
}

export default dbConnection;
