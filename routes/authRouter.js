import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authControllers.js";
import verifyEmail from "../controllers/verifyEmail.js";
import resendVerificationEmail from "../controllers/resendVerificationEmail.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import authenticate from "../middleware/authenticate.js";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, getCurrentUser);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/verify", resendVerificationEmail);

export default authRouter;
