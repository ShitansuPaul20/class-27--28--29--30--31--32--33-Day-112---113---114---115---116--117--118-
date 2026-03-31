const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('./routes/auth.routes');
const songRoutes = require('./routes/song.routes');
const path = require('path');

const allowedOrigins = [
    'http://localhost:5173', 
    'https://vibee-jw9q.onrender.com' 
];

app.use(cors({
    origin: function (origin, callback) {
       
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy block: This origin is not allowed'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
