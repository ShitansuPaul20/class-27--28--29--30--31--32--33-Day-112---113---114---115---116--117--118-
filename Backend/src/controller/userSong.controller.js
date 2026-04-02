const UserSong = require('../models/userSong.model');
const Song = require('../models/song.model');
const User = require('../models/user.model');
const imagekit = require('../config/imagekit');

async function uploadUserSong(req, res) {
    try {
        const { title, mood } = req.body;
        const userId = req.user.id;
        const files = req.files;

        // Validate required fields
        if (!title || !mood) {
            return res.status(400).json({
                message: "Title and mood are required"
            });
        }

        if (!files?.songFile || files.songFile.length === 0) {
            return res.status(400).json({
                message: "Song file is required"
            });
        }

        const songFile = files.songFile[0];
        let posterUrl = null;
        let songUrl = null;

        try {
            // Upload song file to ImageKit
            const songUpload = await imagekit.upload({
                file: songFile.buffer,
                fileName: `${Date.now()}-${title.replace(/\s+/g, '-')}.${songFile.mimetype.split('/')[1]}`,
                folder: `/vibee/user-uploads/${userId}/songs/`
            });
            songUrl = songUpload.url;

            // Upload poster file if provided
            if (files?.posterFile && files.posterFile.length > 0) {
                const posterFile = files.posterFile[0];
                const posterUpload = await imagekit.upload({
                    file: posterFile.buffer,
                    fileName: `${Date.now()}-${title.replace(/\s+/g, '-')}-poster.${posterFile.mimetype.split('/')[1]}`,
                    folder: `/vibee/user-uploads/${userId}/posters/`
                });
                posterUrl = posterUpload.url;
            }
        } catch (uploadError) {
            console.error('ImageKit upload error:', uploadError);
            return res.status(500).json({
                message: "Failed to upload files to storage",
                error: uploadError.message
            });
        }

        // Create user song record
        const userSong = await UserSong.create({
            userId,
            title,
            url: songUrl,
            posterUrl: posterUrl || null,
            mood,
            source: 'user'
        });

        // Add to user's song history
        await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    songHistory: {
                        type: 'uploaded',
                        songTitle: title,
                        mood,
                        timestamp: new Date()
                    }
                }
            }
        );

        res.status(201).json({
            message: "Song uploaded successfully",
            song: userSong
        });
    } catch (error) {
        console.error('Error uploading song:', error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}

async function getUserSongs(req, res) {
    try {
        const userId = req.user.id;

        const userSongs = await UserSong.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "User songs fetched successfully",
            songs: userSongs
        });
    } catch (error) {
        console.error('Error fetching user songs:', error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}

async function getSongsByMood(req, res) {
    try {
        const { mood } = req.query;
        const userId = req.user.id;

        if (!mood) {
            return res.status(400).json({
                message: "Mood parameter is required"
            });
        }

        // Fetch admin songs
        const adminSongs = await Song.find({ mood }).lean();

        // Fetch user songs
        const userSongs = await UserSong.find({ userId, mood }).lean();

        // Mark source for each song
        const markedAdminSongs = adminSongs.map(song => ({
            ...song,
            source: 'admin'
        }));

        const markedUserSongs = userSongs.map(song => ({
            ...song,
            source: 'user'
        }));

        // Combine and shuffle
        const allSongs = [...markedAdminSongs, ...markedUserSongs];
        const shuffledSongs = allSongs.sort(() => Math.random() - 0.5);

        res.status(200).json({
            message: "Songs fetched successfully",
            songs: shuffledSongs,
            stats: {
                adminSongs: markedAdminSongs.length,
                userSongs: markedUserSongs.length
            }
        });
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}

async function deleteUserSong(req, res) {
    try {
        const { songId } = req.params;
        const userId = req.user.id;

        const song = await UserSong.findById(songId);

        if (!song) {
            return res.status(404).json({
                message: "Song not found"
            });
        }

        if (song.userId.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized to delete this song"
            });
        }

        await UserSong.findByIdAndDelete(songId);

        res.status(200).json({
            message: "Song deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}

module.exports = {
    uploadUserSong,
    getUserSongs,
    getSongsByMood,
    deleteUserSong
};
