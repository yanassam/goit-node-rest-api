import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import User from "../models/user.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import sendEmail from "../services/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;
console.log("JWT_SECRET in authControllers:", JWT_SECRET);

const registerHandler = async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
  const verificationToken = nanoid();
  console.log("Generated verificationToken:", verificationToken);

  try {
    console.log("Attempting to create new user with data:", {
      username: username || "defaultUsername",
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    const newUser = await User.create({
      username: username || "defaultUsername",
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    console.log("New user created successfully:", newUser);
    const verificationLink = `${BASE_URL}/users/verify/${verificationToken}`;
    const emailContent = {
      to: email,
      subject: "Email Verification",
      html: `<a href="${verificationLink}">Click here to verify your email</a>`,
    };

    await sendEmail(emailContent);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        username: newUser.username,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw HttpError(400, "Error creating user");
  }
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  console.log("Generated token:", token);

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      username: user.username,
      avatarURL: user.avatarURL,
    },
  });
};

const logoutHandler = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).send();
};

const getCurrentUserHandler = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const register = ctrlWrapper(registerHandler);
export const login = ctrlWrapper(loginHandler);
export const logout = ctrlWrapper(logoutHandler);
export const getCurrentUser = ctrlWrapper(getCurrentUserHandler);
