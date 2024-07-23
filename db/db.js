// import mongoose from "mongoose";

import mongoose from "mongoose";

const initMongoDBConnection = async () => {
  try {
    const DB_HOST =
      "mongodb+srv://yana:SalqfhB3Y7aYKFdB@cluster0.dbd3jcd.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(`Connection error: ${error.message}`);
    throw error;
  }
};

export default initMongoDBConnection;
