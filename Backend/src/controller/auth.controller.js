const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { model } = require('mongoose');
const BlacklistModel = require('../models/blacklist.model');
const redis = require('../config/cache');

async function registerController(req, res){
    try {
        const {username, email , password} = req.body;
        const existingUser = await userModel.findOne({
            $or: [
                {email},
                {username}
            ]
        });
        if(existingUser){
            return res.status(400).json({message: "Username or email already exists"});
        }   
        const newUser = new userModel({username, email, password});
        await newUser.save();
        const token = jwt.sign({
            id: newUser._id,
            username: newUser.username,
        }, process.env.JWT_SECRET,
        {
            expiresIn: "3d"
        });
        res.cookie("token",token, {
            httpOnly: true,
            sameSite: "strict",
        })
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }   
}

async function loginController(req, res){
    try {
        const {emailOrUsername, password} = req.body;
        const user = await userModel.findOne({
                $or: [
                    {email: emailOrUsername},
                    {username: emailOrUsername}
                ]
            }).select("+password");

        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, process.env.JWT_SECRET,
        {
            expiresIn: "3d"
        });
        res.cookie("token",token, {
            httpOnly: true,
            secure: true,      
            sameSite: "none",  
            maxAge: 3 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}

async function getMe(req,res){
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User fetched successfully",
        user
    });

}

async function logoutController(req, res){

    token = req.cookies.token;

    res.clearCookie("token");

    await redis.set(token, Date.now().toString() , "EX", 3*24*60*60);

    res.status(200).json({
        message: "User logged out successfully"
    });
}

async function updateProfileController(req, res) {
    try {
        const { fullName, profilePicture } = req.body;
        const userId = req.user.id;

        const user = await userModel.findByIdAndUpdate(
            userId,
            {
                fullName: fullName || undefined,
                profilePicture: profilePicture || undefined,
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
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
                history: user.songHistory.sort((a, b) => b.timestamp - a.timestamp),
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function addToHistoryController(req, res) {
    try {
        const { songTitle, mood, type } = req.body; // type: 'uploaded' or 'listened'
        const userId = req.user.id;

        const user = await userModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    songHistory: {
                        type,
                        songTitle,
                        mood,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Added to history successfully",
            user
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports = {
    registerController,
    loginController,
    getMe,
    logoutController,
    updateProfileController,
    getUserStatsController,
    addToHistoryController
}
