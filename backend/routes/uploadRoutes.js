import path from 'path';
import express from 'express';
import multer from 'multer';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('Setting upload destination...');
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    console.log('Generated filename:', uniqueName);
    cb(null, uniqueName);
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  console.log('File validation:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    extname: path.extname(file.originalname).toLowerCase(),
    extnameValid: extname,
    mimetypeValid: mimetype
  });

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${filetypes} are allowed.`));
  }
}

// Create upload middleware with better error handling
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    try {
      checkFileType(file, cb);
    } catch (error) {
      cb(error);
    }
  },
  limits: { fileSize: 5000000 }, // 5MB limit
});

// @desc    Upload an image
// @route   POST /api/uploads
// @access  Private/Admin
router.post('/', protect, admin, (req, res, next) => {
  console.log('=== UPLOAD START ===');
  console.log('Headers:', req.headers);
  console.log('User:', req.user ? req.user._id : 'No user');
  
  // Use upload middleware
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.log('MULTER UPLOAD ERROR:', err.message);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'File too large. Maximum size is 5MB.'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            message: 'Unexpected field. Please use "image" as the field name.'
          });
        }
      }
      return res.status(400).json({
        message: err.message || 'Upload failed'
      });
    }

    // If we get here, multer processed the file successfully
    console.log('File received:', req.file);
    console.log('Body:', req.body);

    try {
      if (!req.file) {
        console.log('ERROR: No file uploaded');
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;
      console.log('SUCCESS: File uploaded to:', imagePath);

      res.json({
        message: 'File uploaded successfully',
        image: imagePath
      });
      
      console.log('=== UPLOAD SUCCESS ===');
    } catch (error) {
      console.log('ERROR in upload handler:', error.message);
      res.status(400).json({ 
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
      });
    }
  });
});

export default router;