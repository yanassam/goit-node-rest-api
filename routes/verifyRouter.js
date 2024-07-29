import { Router } from "express";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const verifyEmailHandler = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.isVerified) {
    throw HttpError(400, "User already verified");
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
};

const verifyEmail = ctrlWrapper(verifyEmailHandler);

const router = Router();

router.get("/verify/:verificationToken", verifyEmail);

export default router;
