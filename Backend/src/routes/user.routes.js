const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middlewire');

router.put("/update-profile", authMiddleware.authUser, upload.single('profilePicture'), userController.updateProfileController);
router.get("/stats", authMiddleware.authUser, userController.getUserStatsController);
router.get("/history", authMiddleware.authUser, userController.addToHistoryController);

module.exports = router;