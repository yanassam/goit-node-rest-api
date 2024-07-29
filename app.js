import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import fs from "fs";
import initMongoDBConnection from "./db/db.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
console.log("public static set up");

const publicDir = path.join("public");
const avatarsDir = path.join(publicDir, "avatars");

if (!fs.existsSync(publicDir)) {
  console.log("Creating public directory...");
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(avatarsDir)) {
  console.log("Creating avatars directory...");
  fs.mkdirSync(avatarsDir);
}

console.log("Setting up routes...");
app.use("/api/contacts", contactsRouter);
console.log("contactsRouter set up");

app.use("/users", authRouter);
console.log("authRouter set up");

app.use("/users", userRouter);
console.log("userRouter set up");

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error handler called:", err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const startServer = async () => {
  try {
    console.log("Initializing MongoDB connection...");
    await initMongoDBConnection();
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

console.log("Starting server...");
startServer();
