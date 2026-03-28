const express = require('express');
const router = express.Router();
const songController = require('../controller/song.controller');
const upload = require('../middlewares/upload.middlewire');

router.post('/add', upload.single('song'), songController.uploadSong);
// router.get('/get', songController.getSongs);
// router.delete('/delete/:id', songController.deleteSong);

module.exports = router;