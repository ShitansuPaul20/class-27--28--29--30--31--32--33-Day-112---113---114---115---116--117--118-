const multer = require('multer');
const path = require('path');

// Storage configuration - store in memory for direct upload to ImageKit
const storage = multer.memoryStorage();

// File filter for audio and image files
const fileFilter = (req, file, cb) => {
    // Allowed MIME types
    const allowedMimes = {
        audio: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a'],
        image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    };

    const isAudio = allowedMimes.audio.includes(file.mimetype);
    const isImage = allowedMimes.image.includes(file.mimetype);

    if (isAudio || isImage) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
};

// Create multer instance with limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 
    }
});

const uploadSongFile = upload.fields([
    { name: 'songFile', maxCount: 1 },
    { name: 'posterFile', maxCount: 1 }
]);

module.exports = {
    upload,
    uploadSongFile
};
