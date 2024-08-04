import express from 'express';
import jwt from 'jsonwebtoken';
import loadEnvFile from '../utils/envUtil.js';
import * as authService from '../services/authService.js';

const envVariables = loadEnvFile('./.env');

const router = express.Router();


// User registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const registerResult = await authService.registerUser(name, email, password);
    if (registerResult) {
        console.log(`User ${name} successfully registered - 200`);
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to register' });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const loginResult = await authService.loginUser(email, password);
    if (loginResult) {
        console.log('User successfully logged in via password - 200');
        res.json({ success: true, token: loginResult });
    } else {
        res.status(400).json({ error: "Login failed" });
    }
});

router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    const googleResult = await authService.googleLogin(token);
    if (googleResult) {
        console.log('User successfully logged in via google - 200');
        res.json({ success: true, token: googleResult });
    } else {
        res.status(500).json({ success: false, error: 'Google LoginPage Failed' });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const profileResult = await authService.getProfile(userId);
    if (profileResult) {
        console.log('User profile GET success - 200');
        res.json({ success: true, profile: profileResult });
    } else {
        res.status(500).json({ success:false, error: 'Failed to GET Profile'} )
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { name, trailsHiked, experienceLevel } = req.body;
    const updateResult = await authService.updateProfile(name, trailsHiked, experienceLevel, req.user["userId"]);
    if (updateResult) {
        console.log('User profile PUT update success - 200');
        res.json({success: true});
    } else {
        res.status(500).json({ success:false, error: 'Failed to Update Profile'} )
    }
});

// Get user friends
router.get('/friends', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const friendsResult = await authService.getFriends(userId);
    if (friendsResult) {
        console.log('Friends GET success - 200');
        res.json({ success: true, friends: friendsResult });
    } else {
        res.status(500).json({ success: false, error: 'Failed to GET Friends' })
    }
});

router.get('/verify-token', authenticateToken, (req, res) => {
    const { userId } = req.user;
    res.json({ valid: true, userId: userId });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, envVariables["JWT_SECRET"], (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
}

export default router;