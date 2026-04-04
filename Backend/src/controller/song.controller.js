const songModel = require('../models/song.model');
const id3 = require('node-id3');
const storageService = require('../services/storage.service');
const userModel = require('../models/user.model');

async function uploadSong(req, res) {
    try {
        const songBuffer = req.file.buffer
        const { mood } = req.body
        const currentUserId = req.user.id

        const tags = id3.read(songBuffer)
        console.log("Tags:", tags)
        console.log("Title:", tags.title)
        console.log("Image:", tags.image)
        // title fallback
        const title = tags.title || req.file.originalname.replace(/\.[^/.]+$/, '') || 'Unknown Title'

        // song upload hamesha hoga
        const songFile = await storageService.uploadFile({
            buffer: songBuffer,
            filename: `${title}-${Date.now()}.mp3`,
            folder: "/cohort-2/moodify/songs"
        })

        // poster sirf tab upload karo jab image ho
        let posterUrl = null
        if (tags.image?.imageBuffer) {
            const posterFile = await storageService.uploadFile({
                buffer: tags.image.imageBuffer,
                filename: `${title}-${Date.now()}.jpeg`,
                folder: "/cohort-2/moodify/posters"
            })
            posterUrl = posterFile.url
        }

        const song = await songModel.create({
            title,
            url: songFile.url,
            posterUrl, // null bhi ho sakta hai
            mood,
            uploadedBy: currentUserId,
        })

        await userModel.findByIdAndUpdate(currentUserId, {
            $push: {
                songHistory: {
                    type: 'uploaded',
                    songId: song._id,
                    songTitle: song.title,
                    mood: mood,
                    timestamp: new Date()
                }
            }
        })

        res.status(201).json({
            message: "song created successfully",
            song
        })

    } catch (err) {
        console.error("Upload Song Error:", err)
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

async function getSong(req, res) {
    try {
        const { mood } = req.query; 
        const userId = req.user.id;

        let query = {
            $or: [
                { uploadedBy: null },    
                { uploadedBy: userId }   
            ]
        };

       
        if (mood && mood !== 'All') {
          
            query = {
                $and: [
                    { $or: query.$or }, 
                    { mood: mood }     
                ]
            };
        }

     
        const songs = await songModel.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: songs.length,
            detectedMood: mood || 'All',
            songs
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ 
            message: "Error fetching songs", 
            error: error.message 
        });
    }
}

async function getSongbyUser(req, res) {

    const currentUserId = req.user.id;

    const songs = await songModel.find({ uploadedBy: currentUserId });

    res.status(200).json({
        message: "songs fetched successfully.",
        songs: songs,
    });
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

async function deleteUserSong(req, res) {
    try {
        const { songId } = req.params;
        const userId = req.user.id;
        
        const song = await songModel.findById(songId);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }
        if (song.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this song" });
        }
        
        await songModel.findByIdAndDelete(songId);
        
        await userModel.findByIdAndUpdate(userId, {
            $pull: { songHistory: { songId: song._id } }
        });
        
        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    uploadSong,
    getSong,
    getSongbyUser,
    getSongs,
    deleteUserSong
};