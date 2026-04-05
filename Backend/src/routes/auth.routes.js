const { Router } = require('express');
const authController = require('../controller/auth.controller');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const router = Router();

router.post('/register', authController.registerController);
router.post('/login', authController.loginController);
router.get('/logout', authController.logoutController);

router.get('/google', (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state: req.query.action || 'login'
    })(req, res, next)
})

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`)
        }

        if (!user) {
            const reason = info?.reason || 'unknown'
            const action = req.query.state

            if (action === 'login' && reason === 'not_registered') {
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=not_registered`)
            }

            if (action === 'register' && reason === 'already_exists') {
                return res.redirect(`${process.env.FRONTEND_URL}/register?error=already_exists`)
            }

            return res.redirect(`${process.env.FRONTEND_URL}/login?error=gmail_only`)
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
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
    })(req, res, next)
})

module.exports = router;