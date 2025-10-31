import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // absolute path
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/uploads/${req.file.filename}`);
});

export default router;
