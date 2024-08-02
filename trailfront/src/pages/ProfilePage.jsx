import React, { useState, useEffect } from 'react';
import { useAuth } from '../assets/AuthContext';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('http://localhost:65535/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setProfile(data.profile);
            } else {
                setError(data.error || 'Failed to fetch profile');
            }
        };

        fetchProfile();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <h1>Profile</h1>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <p>Trails Hiked: {profile.trailsHiked}</p>
            <p>Experience Level: {profile.experienceLevel}</p>
            <p>Number of Friends: {profile.numberOfFriends}</p>
        </div>
    );
};

export default ProfilePage;