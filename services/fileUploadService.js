const { S3Client, GetObjectCommand, PutObjectCommand,DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

/**
 * Generate a presigned URL for retrieving an object (e.g., profile, logo, resume).
 * @param {string} key - The key (path) of the object in the S3 bucket.
 * @param {number} expiresIn - The expiration time for the URL in seconds (default: 3600s = 1 hour).
 * @returns {Promise<string>} - A presigned URL for accessing the object.
 */
async function getObjectURL(key, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      
    });
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating presigned URL for GET:", error);
    throw error;
  }
}

/**
 * Generate a presigned URL for uploading an object.
 * @param {string} filename - The desired filename for the object in the S3 bucket.
 * @param {string} contentType - The MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @param {string} folder - The folder where the file will be stored (e.g., 'user-profiles', 'job-assets', 'company-logos').
 * @param {number} expiresIn - The expiration time for the URL in seconds (default: 3600s = 1 hour).
 * @returns {Promise<string>} - A presigned URL for uploading the object.
 */
async function putObjectURL(filename, contentType, folder, expiresIn = 3600) {
  try {
    // Ensure folder is provided and is not empty
    if (!folder) {
      throw new Error("Folder name is required.");
    }

    const key = `${folder}/${filename}`; // Organize files by folder
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      
    });
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating presigned URL for PUT:", error);
    throw error;
  }
}

async function deleteFileFromS3(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
}

module.exports = {
  getObjectURL,
  putObjectURL,
  deleteFileFromS3
};
