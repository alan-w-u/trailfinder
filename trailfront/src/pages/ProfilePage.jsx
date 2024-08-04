import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../components/Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({
        name: '',
        email: '',
        profilepictureurl: '',
    });
    const { login, logout } = useAuth();
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
                        email: data.profile.EMAIL,
                        profilepictureurl: '',
                    });
                } else {
                    setError(data.error || 'Failed to fetch profile');
                }
            } catch (error) {
                setError('Network error: ' + error.message);
            }
        };

        const fetchFriends = async () => {
            try {
                const response = await fetch('http://localhost:65535/auth/friends', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setFriends(data.friends);
                } else {
                    setError(data.error || 'Failed to fetch friends');
                }
            } catch (error) {
                setError('Network error: ' + error.message);
            }
        };

        fetchProfile();
        fetchFriends();
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
                    email: updatedProfile.email,
                    profilepictureurl: updatedProfile.profilepictureurl
                })
            });
            const data = await response.json();
            if (data.success) {
                if (data.token) {
                    logout();
                    login(data.token);
                }
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    NAME: updatedProfile.name,
                    EMAIL: updatedProfile.email,
                    PROFILEPICTURE: updatedProfile.profilepictureurl,
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
    if (!profile || !friends) return <div>Loading...</div>;

    return (
        <div className="profile-page">
            <div className="profile">
                <h1>Profile</h1>
                <img className="profile-picture"
                    src={(profile.PROFILEPICTURE) ? `data:image/jpeg;base64,${profile.PROFILEPICTURE}`
                        : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                    alt="Profile"
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
                    }}
                />
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="profile-form-group">
                            <label>Name:</label>
                            <input type="text" name="name" value={updatedProfile.name} onChange={handleChange} />
                        </div>
                        <div className="profile-form-group">
                            <label>Email:</label>
                            <input type="text" name="email" value={updatedProfile.email} onChange={handleChange} />
                        </div>
                        <div className="profile-form-group">
                            <label>Profile Picture URL:</label>
                            <input type="text" name="profilepictureurl" value={updatedProfile.profilepictureurl} onChange={handleChange} />
                        </div>
                        <button className="positive" type="submit">Save</button>
                        <button className="negative" type="button" onClick={handleEditToggle}>Cancel</button>
                    </form>
                ) : (
                    <>
                        <div className="profile-info">
                            <p>Name: <b>{profile.NAME}</b></p>
                            <p>Email: <b>{profile.EMAIL}</b></p>
                            <p>Trails Hiked: <b>{profile.TRAILSHIKED}</b></p>
                            <p>Experience Level: <b>{profile.EXPERIENCELEVEL}</b></p>
                            <p>Number of Friends: <b>{profile.NUMBEROFFRIENDS}</b></p>
                        </div>
                        <button className="positive" onClick={handleEditToggle}>Edit</button>
                        <button className="negative" onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>

            <div className="friends">
                <h1>Friends</h1>
                <div className="friend-list">
                    {friends.map(friend => (
                        <div className="friend">
                            <img className="friend-picture"
                                src={(friend.PROFILEPICTURE) ? `data:image/jpeg;base64,${friend.PROFILEPICTURE}`
                                    : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                                alt="Profile"
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
                                }}
                            />
                            <p key={friend.FRIENDID}>
                                Name: <b>{friend.NAME}</b>
                                <br />
                                Trails Hiked: <b>{friend.TRAILSHIKED}</b>
                                <br />
                                Experience Level: <b>{friend.EXPERIENCELEVEL}</b>
                                <br />
                                Date Friended: <b>{new Date(friend.DATEFRIENDED).toLocaleDateString()}</b>
                            </p>
                        </div>
                    ))}
                </div>
                <button className="positive">Add Friend</button>
            </div>
        </div>
    );
}

export default ProfilePage;
