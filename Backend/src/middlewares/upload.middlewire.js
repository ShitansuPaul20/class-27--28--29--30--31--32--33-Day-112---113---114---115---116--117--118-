const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 'public/temp' folder pehle se bana hona chahiye
        cb(null, './public/temp'); 
    },
    filename: function (req, file, cb) {
        // File ka original name preserve karne ke liye unique suffix add karna achha hota hai
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

module.exports = upload;