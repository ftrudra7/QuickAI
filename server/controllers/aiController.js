import Groq from "groq-sdk";
import axios from "axios";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import FormData from "form-data";
import { cloudinary } from "../configs/cloudinary.js";
import fs from "fs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =========================================
// Helper Functions
// =========================================

const checkFreeUsage = (plan, freeUsage) => {
  return plan !== "premium" && freeUsage >= 10;
};

const incrementFreeUsage = async (userId, plan, freeUsage) => {
  if (plan === "premium") return;

  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      free_usage: freeUsage + 1,
    },
  });
};

// =========================================
// Generate Article
// =========================================

export const generateArticle = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, length } = req.body;

    const plan = req.plan;
    const freeUsage = req.free_usage;

    if (!prompt || !length) {
      return res.status(400).json({
        success: false,
        message: "Prompt and article length are required.",
      });
    }

    if (checkFreeUsage(plan, freeUsage)) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to Premium.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a professional content writer. Write detailed, engaging, SEO-friendly articles in Markdown format.",
        },
        {
          role: "user",
          content: `Write a professional article of approximately ${length} words on:

${prompt}`,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate the article.",
      });
    }

    await sql`
      INSERT INTO creations
      (user_id, prompt, content, type)
      VALUES
      (${userId}, ${prompt}, ${content}, 'article')
    `;

    await incrementFreeUsage(userId, plan, freeUsage);

    return res.status(200).json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("Generate Article Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// =========================================
// Generate Blog Titles
// =========================================

export const generateBlogTitle = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt } = req.body;

    const plan = req.plan;
    const freeUsage = req.free_usage;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    if (checkFreeUsage(plan, freeUsage)) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to Premium.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are an SEO specialist who generates highly clickable blog titles.",
        },
        {
          role: "user",
          content: `Generate 10 catchy SEO-friendly blog titles for:

"${prompt}"

Rules:
- Return only titles.
- Number them.
- Maximum 70 characters each.
- No explanations.`,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate blog titles.",
      });
    }

    await sql`
      INSERT INTO creations
      (user_id, prompt, content, type)
      VALUES
      (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    await incrementFreeUsage(userId, plan, freeUsage);

    return res.status(200).json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("Generate Blog Title Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// =========================================
// Generate Image
// =========================================

export const generateImage = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, publish } = req.body;

    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for Premium users.",
      });
    }

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations
      (user_id, prompt, content, type, publish)
      VALUES
      (
        ${userId},
        ${prompt},
        ${uploadResult.secure_url},
        'image',
        ${publish ?? false}
      )
    `;

    return res.status(200).json({
      success: true,
      content: uploadResult.secure_url,
    });

  } catch (error) {
    console.error("Generate Image Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// =========================================
// Remove Image Background
// =========================================

export const removeImageBackground = async (req, res) => {
  try {
    const userId = req.userId;
    const image = req.file;

    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for Premium users.",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
        },
      ],
    });

    await sql`
      INSERT INTO creations
      (user_id, prompt, content, type)
      VALUES
      (
        ${userId},
        'Background Removed',
        ${uploadResult.secure_url},
        'image'
      )
    `;

    return res.status(200).json({
      success: true,
      content: uploadResult.secure_url,
    });

  } catch (error) {
    console.error("Remove Background Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// =========================================
// Remove Image Object
// =========================================

export const removeImageObject = async (req, res) => {
  try {
    const userId = req.userId;

    const image = req.file;
    const { object } = req.body;

    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for Premium users.",
      });
    }

    if (!image || !object) {
      return res.status(400).json({
        success: false,
        message: "Image and object name are required.",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });

    await sql`
      INSERT INTO creations
      (user_id, prompt, content, type)
      VALUES
      (
        ${userId},
        ${`Removed "${object}" from image`},
        ${imageUrl},
        'image'
      )
    `;

    return res.status(200).json({
      success: true,
      content: imageUrl,
    });

  } catch (error) {
    console.error("Remove Object Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// =========================================
// Resume Review
// =========================================

export const resumeReview = async (req, res) => {
  try {
    const userId = req.userId;
    const resume = req.file;

    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for Premium users.",
      });
    }

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Resume file size exceeds 5MB.",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);

    // Dynamic import (prevents Vercel startup crash)
    let pdfText = "";

    try {
      const pdfParse = (await import("pdf-parse")).default;
      const pdfData = await pdfParse(dataBuffer);
      pdfText = pdfData.text;
    } catch (pdfError) {
      console.error("PDF Parse Error:", pdfError);

      return res.status(500).json({
        success: false,
        message: "Unable to parse the uploaded PDF.",
      });
    }

    const prompt = `
You are an experienced HR recruiter and ATS expert.

Review the following resume.

Give feedback under these headings:

# Overall Score
# Strengths
# Weaknesses
# ATS Compatibility
# Suggestions for Improvement

Resume:

${pdfText}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "You are a professional HR recruiter and resume reviewer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        message: "AI failed to review the resume.",
      });
    }

    await sql`
      INSERT INTO creations
      (user_id, prompt, content, type)
      VALUES
      (
        ${userId},
        'Resume Review',
        ${content},
        'resume-review'
      )
    `;

    return res.status(200).json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("Resume Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};