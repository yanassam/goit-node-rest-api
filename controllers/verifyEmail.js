import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log("Received verificationToken:", verificationToken);

    const user = await User.findOne({ verificationToken });
    if (!user) {
      console.log("User not found for token:", verificationToken);
      throw HttpError(404, "User not found");
    }

    console.log("User found:", user);
    user.verify = true;
    user.verificationToken = null;
    await user.save();

    console.log("User verification updated:", user);
    res.json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error during email verification:", error);
    next(error);
  }
};

export default verifyEmail;
