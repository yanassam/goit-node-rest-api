import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../services/sendEmail.js";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config();

const { BASE_URL } = process.env;

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(HttpError(400, "missing required field email"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(HttpError(404, "User not found"));
    }

    if (user.verify) {
      return next(HttpError(400, "Verification has already been passed"));
    }

    const verificationToken = nanoid();
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `${BASE_URL}/users/verify/${verificationToken}`;
    const emailContent = {
      to: email,
      subject: "Email Verification",
      html: `<a href="${verificationLink}">Click here to verify your email</a>`,
    };

    await sendEmail(emailContent);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error during resend verification:", error);
    next(error);
  }
};

export default resendVerificationEmail;
