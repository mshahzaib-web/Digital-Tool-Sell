const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);

    return conn;
  } catch (error) {
    console.error(`MongoDB Atlas connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
