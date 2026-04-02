const mongoose = require('mongoose');

const userSongSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    posterUrl: {
        type: String,
        default: null,
    },
    mood: {
        type: String,
        required: true,
        enum: {
            values: ['Happy', 'Sad', 'Surprised'],
            message: 'Mood must be one of Happy, Sad, Surprised'
        }
    },
    source: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

userSongSchema.index({ userId: 1, createdAt: -1 });

const UserSong = mongoose.model('UserSong', userSongSchema);

module.exports = UserSong;
