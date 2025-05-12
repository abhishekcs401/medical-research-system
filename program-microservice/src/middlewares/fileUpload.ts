import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');

// Check if directory exists, if not create it (only once at server startup)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('➡️ File upload middleware');
    cb(null, uploadDir); // Use the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    // Rename the file to avoid name conflicts by adding a timestamp to the filename
    cb(null, Date.now() + path.extname(file.originalname)); // Adds timestamp to filename
  },
});

// Initialize Multer with storage options and file size limit
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      console.log('➡️ File upload middleware triggered');
      cb(null, true); // Accept the file
    } else {
      req.fileValidationError = 'Only image, PDF, and Word files are allowed';
      cb(null, false); // Reject file with custom error message
    }
  },
});

// Export the middleware
export const uploadFile = upload.single('attachment'); // 'attachment' is the name of the file field
