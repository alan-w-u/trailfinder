import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import ProfileSection from '../components/ProfileSection';
import FriendsSection from '../components/FriendsSection';
import '../components/Profile.css';

const ProfilePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="profile-page">
            <ProfileSection handleLogout={handleLogout} />
            <FriendsSection />
        </div>
    );
}

export default ProfilePage;