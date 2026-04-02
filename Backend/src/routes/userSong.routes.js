const express = require('express');
const router = express.Router();
const userSongController = require('../controller/userSong.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadSongFile } = require('../middlewares/upload.middleware');

router.post('/upload', authMiddleware.authUser, uploadSongFile, userSongController.uploadUserSong);
router.get('/my-songs', authMiddleware.authUser, userSongController.getUserSongs);
router.get('/by-mood', authMiddleware.authUser, userSongController.getSongsByMood);
router.delete('/:songId', authMiddleware.authUser, userSongController.deleteUserSong);

module.exports = router;
