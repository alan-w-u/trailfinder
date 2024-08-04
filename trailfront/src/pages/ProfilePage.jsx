import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import ProfileSection from '../components/ProfileSection';
import FriendsSection from '../components/FriendsSection';
import '../components/Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({
        name: '',
        email: '',
        profilepictureurl: '',
    });
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="profile-page">
            <ProfileSection handleLogout={handleLogout} />
            <FriendsSection />
        </div>
    );
}

export default ProfilePage;