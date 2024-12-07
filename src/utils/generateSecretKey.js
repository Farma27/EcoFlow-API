const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a secure random key
const secretKey = crypto.randomBytes(32).toString('hex');

// Define the path to the .env file
const envFilePath = path.resolve(__dirname, '../../.env');

// Read the existing .env file content
let envFileContent = '';
if (fs.existsSync(envFilePath)) {
  envFileContent = fs.readFileSync(envFilePath, 'utf8');
}

// Update or add the JWT_SECRET_KEY entry
const keyValue = `JWT_SECRET_KEY=${secretKey}`;
if (envFileContent.includes('JWT_SECRET_KEY=')) {
  envFileContent = envFileContent.replace(/JWT_SECRET_KEY=.*/, keyValue);
} else {
  envFileContent += `\n${keyValue}`;
}

// Write the updated content back to the .env file
fs.writeFileSync(envFilePath, envFileContent, 'utf8');

console.log('Secret key generated and stored in .env file');