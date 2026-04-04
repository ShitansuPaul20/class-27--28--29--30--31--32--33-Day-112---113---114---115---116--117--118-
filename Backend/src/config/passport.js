const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        // sirf gmail allow karo
        if (!email.endsWith('@gmail.com')) {
            return done(null, false, { message: 'Only Gmail accounts are allowed' });
        }

        // pehle check karo user exist karta hai ya nahi
        let user = await userModel.findOne({ email });

        if (user) {
            return done(null, user);
        }

        // naya user banao
        user = await userModel.create({
            username: profile.displayName.replace(/\s+/g, '_').toLowerCase(),
            email,
            profilePicture: profile.photos[0]?.value.replace('=s96-c', '=s400-c') || null,
            googleId: profile.id,
            password: Math.random().toString(36), // dummy password
        });

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;