const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const action = req.query.state

        if (!email.endsWith('@gmail.com')) {
            return done(null, false);
        }

        const existingUser = await userModel.findOne({ email });

        if (action === 'login') {
            // login — user hona chahiye
            if (!existingUser) {
                return done(null, false, { reason: 'not_registered' });
            }
            return done(null, existingUser);
        }

        if (action === 'register') {
            // register — user nahi hona chahiye
            if (existingUser) {
                return done(null, false, { reason: 'already_exists' });
            }

            // naya user banao
            const newUser = await userModel.create({
                username: profile.displayName.replace(/\s+/g, '_').toLowerCase(),
                email,
                profilePicture: profile.photos[0]?.value.replace('=s96-c', '=s400-c') || null,
                googleId: profile.id,
                password: Math.random().toString(36),
            });

            return done(null, newUser);
        }

    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;