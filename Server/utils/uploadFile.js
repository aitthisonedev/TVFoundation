const path = require('path');
const fs = require('fs').promises;

const uploadFile = async (file, folder) => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../public/uploads', folder);
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const filename = `${timestamp}-${originalName}`;
    const filepath = path.join(uploadsDir, filename);

    // Move the file
    await file.mv(filepath);

    // Return the relative path for database storage
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};

module.exports = uploadFile; 