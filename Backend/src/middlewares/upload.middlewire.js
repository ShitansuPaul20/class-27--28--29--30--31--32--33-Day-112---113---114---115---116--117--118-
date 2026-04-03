const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 5MB
    },
});


module.exports = upload;