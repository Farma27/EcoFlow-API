require('dotenv').config();

module.exports = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  bucketName: process.env.BUCKET_NAME,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB
  rateLimit: {
    userLimit: 200, // 200 requests per user
    pathLimit: false, // Disable path-specific rate limiting
    userPathLimit: false, // Disable user-path-specific rate limiting
    headers: true, // Include rate limit headers in the response
    trustProxy: true, // Trust the X-Forwarded-For header for the user's IP address
    userCache: {
      expiresIn: 60 * 60 * 1000 // 1 hour
    }
  }
};