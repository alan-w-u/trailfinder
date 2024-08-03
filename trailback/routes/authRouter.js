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
        console.log('User successfully logged in - 200');
        res.json({ success: true, token: loginResult });
    } else {
        res.status(400).json({ error: "Login failed" });
    }
});

router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    const googleResult = await authService.googleLogin(token);
    if (googleResult) {
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
        res.json({ success: true, profile: profileResult });
    } else {
        res.status(500).json({ success:false, error: 'Failed to GET Profile'} )
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { name, trailsHiked, experienceLevel, userID } = req.body;
    const updateResult = await authService.updateProfile(name, trailsHiked, experienceLevel, userID);
    if (updateResult) {
        res.json({success: true});
    } else {
        res.status(500).json({ success:false, error: 'Failed to Update Profile'} )
    }
});

router.get('/verify-token', authenticateToken, (req, res) => {
    const { userId } = req.user;

    try {
        res.json({ valid: true, userId: userId });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
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