import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
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
                    // logout();
                    // navigate('/login');
                    setError(data.error || 'Failed to fetch profile');
                }
            } catch (error) {
                setError('Network error: ' + error.message);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <h1>Profile</h1>
            <p>Name: {profile["NAME"]}</p>
            <p>Email: {profile["EMAIL"]}</p>
            <p>Trails Hiked: {profile["TRAILSHIKED"]}</p>
            <p>Experience Level: {profile["EXPERIENCELEVEL"]}</p>
            <p>Number of Friends: {profile["NUMBEROFFRIENDS"]}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default ProfilePage;