import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../components/Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({
        name: '',
        trailsHiked: '',
        experienceLevel: '',
    });
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
                    setUpdatedProfile({
                        name: data.profile.NAME,
                        trailsHiked: data.profile.TRAILSHIKED,
                        experienceLevel: data.profile.EXPERIENCELEVEL,
                    });
                } else {
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

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:65535/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: updatedProfile.name,
                    trailsHiked: updatedProfile.trailsHiked,
                    experienceLevel: updatedProfile.experienceLevel,
                    userID: profile.USERID,
                })
            });
            const data = await response.json();
            if (data.success) {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    NAME: updatedProfile.name,
                    TRAILSHIKED: updatedProfile.trailsHiked,
                    EXPERIENCELEVEL: updatedProfile.experienceLevel,
                }));
                setIsEditing(false);
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div className="profile">
            <h1>Profile</h1>
            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-form-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={updatedProfile.name} onChange={handleChange} />
                    </div>
                    <div className="profile-form-group">
                        <label>Trails Hiked:</label>
                        <input type="number" name="trailsHiked" value={updatedProfile.trailsHiked} onChange={handleChange} />
                    </div>
                    <div className="profile-form-group">
                        <label>Experience Level:</label>
                        <input type="text" name="experienceLevel" value={updatedProfile.experienceLevel} onChange={handleChange} />
                    </div>
                    <button className="positive" type="submit">Save</button>
                    <button className="negative" type="button" onClick={handleEditToggle}>Cancel</button>
                </form>
            ) : (
                <div className="profile">
                    <p>Name: <b>{profile.NAME}</b></p>
                    <p>Email: <b>{profile.EMAIL}</b></p>
                    <p>Trails Hiked: <b>{profile.TRAILSHIKED}</b></p>
                    <p>Experience Level: <b>{profile.EXPERIENCELEVEL}</b></p>
                    <p>Number of Friends: <b>{profile.NUMBEROFFRIENDS}</b></p>
                    <button className="positive" onClick={handleEditToggle}>Edit</button>
                    <button className="negative" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
