const songModel = require('../models/song.model');
const id3 = require('node-id3');
const storageService = require('../services/storage.service');


async function uploadSong(req, res) {

    const songBuffer = req.file.buffer
    const { mood } = req.body

    const tags = id3.read(songBuffer)

    const [ songFile, posterFile ] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        }),
        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + ".jpeg",
            folder: "/cohort-2/moodify/posters"
        })
    ])

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    })

    res.status(201).json({
        message: "song created successfully",
        song
    })

}
async function getSong(req, res) {

    const { mood } = req.query

    const songs = await songModel.find({
        mood,
    })

    res.status(200).json({
        message: "songs fetched successfully.",
        songs: songs,
    })

}

async function getSongs(req, res) {
    try {
        const songs = await songModel.find();
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    uploadSong,
    getSong,
    getSongs,
};