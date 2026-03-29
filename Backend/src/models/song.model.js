const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    posterUrl: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
     mood: {
        type: String,
        required: true,
        enum:{
            values: ['Happy', 'Sad', 'Surprised'],
            message: 'Mood must be one of Happy, Sad, Surprised'
        }
    },
});

const songModel = mongoose.model('Song', songSchema);

module.exports = songModel;