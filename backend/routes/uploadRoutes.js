import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

console.log('Upload routes loaded - using memory storage');

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  console.log('🔍 Checking file type for:', file.originalname);
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    console.log('✅ File type validated successfully');
    return cb(null, true);
  } else {
    const error = new Error(`Invalid file type. Only ${filetypes} are allowed.`);
    console.log('❌ File type validation failed:', error.message);
    cb(error);
  }
}

const upload = multer({
  storage: storage, // Memory storage
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 5000000 },
});

// @desc    Upload an image
// @route   POST /api/uploads
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  console.log('🚀 UPLOAD REQUEST RECEIVED - Memory Storage');
  
  try {
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('✅ File received in memory:', {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Since we're using memory storage, we can't save to disk on Render
    // Instead, we'll convert the buffer to base64 and return it
    const base64Image = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

    console.log('✅ Converted image to base64, length:', base64Image.length);

    res.json({
      message: 'File uploaded successfully',
      image: dataUri, // Return base64 data URI
      filename: req.file.originalname
    });

  } catch (error) {
    console.log('❌ Upload error:', error.message);
    res.status(400).json({ 
      message: error.message || 'Upload failed'
    });
  }
});

export default router;