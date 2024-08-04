import express from 'express';
import * as userService from '../services/userService.js';
import {authenticateToken} from "./authRouter.js";



const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const profileResult = await userService.getProfile(userId);
    if (profileResult) {
        console.log('User profile GET success - 200');
        res.json({ success: true, profile: profileResult });
    } else {
        res.status(500).json({ success:false, error: 'Failed to GET Profile'} )
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { name, email, profilepictureurl } = req.body;
    userService.updateProfile(name, email, profilepictureurl, req.user["userId"])
        .then((result) => {
            console.log('User profile PUT update success - 200');
            if (result.newToken) {
                res.json({success: true, token: result.newToken});
            } else {
                res.json({success: true});
            }
        }).catch((e) => {
        res.status(500).json({ success:false, error: e.message} )
    });
});

// Get user friends
router.get('/friends', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const friendsResult = await userService.getFriends(userId);
    if (friendsResult) {
        console.log('Friends GET success - 200');
        res.json({ success: true, friends: friendsResult });
    } else {
        res.status(500).json({ success: false, error: 'Failed to GET Friends' })
    }
});

export default router;