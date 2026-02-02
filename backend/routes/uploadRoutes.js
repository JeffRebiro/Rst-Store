import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Configure Multer to save files in public/images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../public/images")); // save in public/images
  },
  filename(req, file, cb) {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// ✅ Upload route
router.post("/", upload.single("image"), (req, res) => {
  // Return the path that frontend & MongoDB should store
  res.send(`/images/${req.file.filename}`);
});

export default router;
