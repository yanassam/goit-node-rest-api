import mongoose from "mongoose";

const initMongoDBConnection = async () => {
  try {
    const DB_HOST =
      "mongodb+srv://yana:SalqfhB3Y7aYKFdB@cluster0.dbd3jcd.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(DB_HOST);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(`Connection error: ${error.message}`);
    throw error;
  }
};

export default initMongoDBConnection;
