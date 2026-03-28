const jwt = require('jsonwebtoken');
const router = require('../routes/auth.routes');
const blacklistModel = require('../models/blacklist.model');
const redis = require('../config/cache');

async function authUser(req, res, next) {
    const token = req.cookies.token ;

    if (!token) {
        return res.status(401).json({ 
            message: "Unauthorized: No token provided" 
        });
    }

    const isTokenBlacklisted = await redis.get(token);
    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Unauthorized: Token is Invalide"
        });
    }


    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        req.user = decoded

        next()
    }catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }    
}

module.exports = {
    authUser
};