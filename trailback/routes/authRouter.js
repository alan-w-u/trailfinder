import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import loadEnvFile from '../utils/envUtil.js';
import * as authService from '../services/authService.js';

const envVariables = loadEnvFile('./.env');

const router = express.Router();


// User registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const registerResult = await authService.registerUser(name, email, password);
    if (registerResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to register' });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const loginResult = await authService.loginUser(email, password);

    if (loginResult.rows.length > 0) {
        const user = loginResult.rows[0];
        if (await bcrypt.compare(password, user["PASSWORD"])) {
            const token = jwt.sign({ userId: user["USERID"] }, envVariables["JWT_SECRET"], { expiresIn: '1h' });
            res.json({ success:true, token });
        } else {
            res.status(400).json({ error: "Invalid Password" });
        }
    } else {
        res.status(400).json({ error: "User not found" });
    }
});

// Google Auth
const client = new OAuth2Client(envVariables["GOOGLE_CLIENTID"], envVariables["GOOGLE_SECRET"]);

router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    const googleResult = await authService.googleLogin(token, client);
    if (googleResult) {
        res.json({ success: true, token: googleResult });
    } else {
        res.status(500).json({ success: false, error: 'Google LoginPage Failed' });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    const { userID } = req.user;
    console.log(req.user);
    const profileResult = await authService.getProfile(userID);
    if (profileResult) {
        res.json({success: true});
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

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, envVariables["JWT_SECRET"], (err, user) => {
        if (err) return res.sendStatus(403);
        console.log(user);
        req.user = user;
        next();
    });
}

export default router;