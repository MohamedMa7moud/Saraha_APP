import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database has been Connected Successfully");
  } catch (error) {
    console.log("Connection to Database Failed", error.message);
  }
};

export default connectDB;
