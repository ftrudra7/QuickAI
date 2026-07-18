import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";

import aiRouter from "./routes/aiRoutes.js";
import userRouter from "./routes/userRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

// Connect Cloudinary
await connectCloudinary();

// ========================
// Middlewares
// ========================

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Clerk Middleware
app.use(clerkMiddleware());

// ========================
// Health Check
// ========================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "QuickAI Backend is Live 🚀",
  });
});

// ========================
// Routes
// ========================

app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

// ========================
// 404 Handler
// ========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================
// Error Handler
// ========================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ========================
// Local Development
// ========================

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

// ========================
// Export for Vercel
// ========================

export default app;