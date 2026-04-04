const express = require('express');
const router = express.Router();
const songController = require('../controller/song.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middlewire');

router.post('/add', authMiddleware.authUser, upload.single('song'), songController.uploadSong);
router.get('/all', authMiddleware.authUser, songController.getSongs);
router.get('/', authMiddleware.authUser, songController.getSong);
router.get('/getSongs', authMiddleware.authUser, songController.getSongbyUser);
router.delete('/delete/:songId', authMiddleware.authUser, songController.deleteUserSong);

module.exports = router;