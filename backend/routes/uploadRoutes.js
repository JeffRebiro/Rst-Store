import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// Multer saves files temporarily in /uploads
const upload = multer({ dest: "uploads/" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Generate a unique filename
    const filename = `image-${Date.now()}${path.extname(req.file.originalname)}`;
    const localPath = path.join(__dirname, "../public/images", filename);

    // Move file from /uploads to /public/images
    fs.renameSync(req.file.path, localPath);

    // Respond with the URL path that frontend can use
    res.json({
      url: `/images/${filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
