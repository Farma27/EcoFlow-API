require('dotenv').config();

module.exports = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  bucketName: process.env.BUCKET_NAME,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB
  rateLimit: {
    userLimit: 200, // 200 requests per user
    pathLimit: false, 
    userPathLimit: false, 
    headers: true, 
    trustProxy: true, 
    userCache: {
      expiresIn: 60 * 60 * 1000 // 1 hour
    }
  }
};