const {Router} = require('express');
const authController = require('../controller/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware");
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const router = Router();

router.post('/register', authController.registerController);
router.post('/login', authController.loginController);
router.get("/logout", authController.logoutController);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=gmail_only` }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, username: req.user.username },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        res.redirect(process.env.FRONTEND_URL);
    }
);

module.exports = router;
