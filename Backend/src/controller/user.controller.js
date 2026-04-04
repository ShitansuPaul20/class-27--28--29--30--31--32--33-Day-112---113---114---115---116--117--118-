const userModel = require('../models/user.model');
const storageService = require('../services/storage.service');

async function getMe(req,res){
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User fetched successfully",
        user:{
            username: user.username,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
        }
    });

}

async function updateProfileController(req, res) {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ message: "Please select a profile picture" });
        }

  
        const uploadResult = await storageService.uploadFile({
            buffer: req.file.buffer,
            filename: `profile-${userId}-${Date.now()}.jpeg`,
            folder: "/cohort-2/moodify/profiles"
        });

        const user = await userModel.findByIdAndUpdate(
            userId,
            { profilePicture: uploadResult.url },
            { new: true }
        ).select("-password"); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile picture updated successfully",
            user:{
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
        }
        });

    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function getUserStatsController(req, res) {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate statistics
        const totalSongs = user.songHistory.length;
        const moods = { Happy: 0, Sad: 0, Surprised: 0 };
        const uploadedSongs = [];
        const listenedSongs = [];

        user.songHistory.forEach(item => {
            if (item.mood) {
                moods[item.mood]++;
            }
            if (item.type === 'uploaded') {
                uploadedSongs.push(item);
            } else if (item.type === 'listened') {
                listenedSongs.push(item);
            }
        });

        const moodPercentages = {
            Happy: totalSongs > 0 ? Math.round((moods.Happy / totalSongs) * 100) : 0,
            Sad: totalSongs > 0 ? Math.round((moods.Sad / totalSongs) * 100) : 0,
            Surprised: totalSongs > 0 ? Math.round((moods.Surprised / totalSongs) * 100) : 0,
        };

        res.status(200).json({
            message: "User stats fetched successfully",
            stats: {
                totalSongs,
                moods,
                moodPercentages,
                totalUploaded: uploadedSongs.length,
                totalListened: listenedSongs.length,
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function addToHistoryController(req, res) {
    try {
        
        const userId = req.user.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        res.status(200).json({
            message: "Added to history successfully",
            history: user.songHistory.sort((a, b) => b.timestamp - a.timestamp),
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports = {
    getMe,
    updateProfileController,
    getUserStatsController,
    addToHistoryController
}