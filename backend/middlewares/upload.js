const multer = require('multer');
const path = require('path');

// Configure multer to store files in memory as buffers
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    // Accept common image MIME types
    const validMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml',
        'image/heic',
        'image/heif',
        'image/heic-sequence',
        'image/heif-sequence'
    ];

    // Accept common image file extensions
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.heic', '.heif'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Check MIME type or file extension
    if (validMimeTypes.includes(file.mimetype) || validExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
};

// Configure multer with file size limit (10MB)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = upload;