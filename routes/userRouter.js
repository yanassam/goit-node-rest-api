import { Router } from "express";
import multer from "multer";
import jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import authMiddleware from "../middleware/authenticate.js";
import User from "../models/user.js";

const router = Router();

const upload = multer({
  dest: "tmp/",
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res, next) => {
    const { path: tempPath, originalname } = req.file;
    const { _id } = req.user;

    try {
      const avatar = await jimp.read(tempPath);
      avatar.resize(250, 250).quality(60);

      const avatarName = `${_id}_${originalname}`;
      const avatarPath = path.join("public", "avatars", avatarName);

      await avatar.writeAsync(avatarPath);
      await fs.unlink(tempPath);

      const avatarURL = `/avatars/${avatarName}`;
      await User.findByIdAndUpdate(_id, { avatarURL });

      res.json({ avatarURL });
    } catch (error) {
      await fs.unlink(tempPath);
      next(error);
    }
  }
);

export default router;
