const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

// Initialize S3 Client (v3)
const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

/**
 * Creates a dynamic multer upload middleware for S3.
 * @param {string} folder - The folder name in the S3 bucket (e.g., 'profile-images', 'company-logos').
 * @returns {Function} - A middleware function for uploading a single file.
 */
const uploadSingle = (folder) => {
  const upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.BUCKET_NAME,
      //acl: 'public-read',
      key: (req, file, cb) => {
        console.log("Processing file upload:", file);  // Debugging log
        const fileName = `${folder}/${req.user.userId}-${Date.now()}-${file.originalname}`;
        cb(null, fileName);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: (req, file, cb) => {
      // Allow only images, PDFs, and DOC/DOCX files
      const allowedMimes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (allowedMimes.some(mime => file.mimetype.startsWith(mime))) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images, PDFs, DOC, and DOCX files are allowed.'));
      }
    },
  });

  return (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

/**
 * Function to delete a file from S3.
 * @param {string} key - The key (file path) of the file to delete.
 * @returns {Promise<void>}
 */
const deleteFileFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });
    await s3.send(command);
    console.log(`File deleted successfully: ${key}`);
  } catch (error) {
    console.error(`Error deleting file from S3: ${error.message}`);
    throw new Error('Failed to delete file from S3');
  }
};

module.exports = {
  uploadSingle,
  deleteFileFromS3,
};
