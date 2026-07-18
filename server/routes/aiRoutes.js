import express from "express";
import { auth } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

// AI Text Generation
aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-blog-title", auth, generateBlogTitle);

// AI Image Generation
aiRouter.post("/generate-image", auth, generateImage);

// AI Background Removal
aiRouter.post(
  "/remove-background",
  auth,
  upload.single("image"),
  removeImageBackground
);

// AI Object Removal
aiRouter.post(
  "/remove-object",
  auth,
  upload.single("image"),
  removeImageObject
);

// AI Resume Review
aiRouter.post(
  "/resume-review",
  auth,
  upload.single("resume"),
  resumeReview
);

export default aiRouter;