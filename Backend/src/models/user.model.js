const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    }
})

userSchema.pre("save", async function() { 
    if (!this.isModified("password")) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
    } catch (err) {
        throw new Error("Error hashing password: " + err.message);
    } 
})

const User = mongoose.model("User", userSchema);

module.exports = User;