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

module.exports = {
    registerController,
    loginController,
    getMe,
    logoutController
}
