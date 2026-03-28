const songModel = require('../models/song.model');

async function uploadSong(req, res) {
    try {
        // const title  = req.body;

        const songFile = req.file;
        console.log(songFile)

        if (!songFile) {
            return res.status(400).json({ error: 'No song file uploaded' });
        }

            // const newSong = new songModel({
            //     url: songFile.path,
            //     posterUrl: 'https://via.placeholder.com/150', // Placeholder poster URL
            //     title: title,
            // });
            // await newSong.save();


        res.status(201).json({ message: 'Song uploaded successfully' });
    } catch (error) {
        console.error('Error uploading song:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// async function getSongs(req, res) {
//     try {
//         const songs = await songModel.find();
//         res.status(200).json(songs);
//     } catch (error) {
//         console.error('Error fetching songs:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

// async function deleteSong(req, res) {
//     try {
//         const { id } = req.params;
//         await songModel.findByIdAndDelete(id);
//         res.status(200).json({ message: 'Song deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting song:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }       
// }

module.exports = {
    uploadSong,
    // getSongs,
    // deleteSong,
};