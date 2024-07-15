import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;
console.log("JWT_SECRET in authenticate middleware:", JWT_SECRET);

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    console.log("Authorization header missing or invalid");
    return next(HttpError(401, "Not authorized"));
  }

  try {
    console.log("Received token:", token);
    const { id } = jwt.verify(token, JWT_SECRET);
    console.log("Token valid, user ID:", id);
    const user = await User.findById(id);

    if (!user) {
      console.log("User not found");
      return next(HttpError(401, "Not authorized"));
    }

    if (user.token !== token) {
      console.log("Token mismatch");
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;
