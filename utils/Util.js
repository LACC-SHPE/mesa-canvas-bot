const crypto = require('crypto');

// Function to generate a random file name
function generateRandomFileName(extension = '') {
    // Generate a random string
    const randomString = crypto.randomBytes(16).toString('hex');

    // Return the random string with the optional file extension
    return randomString + (extension ? `.${extension}` : '');
}

module.exports = { generateRandomFileName }