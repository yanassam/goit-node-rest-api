import Joi from "joi";

import { emailRegexp } from "../constants/user-constants.js";

export const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const authRefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
