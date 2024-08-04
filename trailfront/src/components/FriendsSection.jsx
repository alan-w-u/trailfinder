import React, { useState, useEffect } from 'react';
import FriendList from './FriendList';

const FriendsSection = () => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch('http://localhost:65535/user/friends', {
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

        fetchFriends();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!friends) return <div>Loading...</div>;

    return (
        <div className="friends">
            <h1>Friends</h1>
            <FriendList friends={friends} />
            <button className="positive">Add Friend</button>
        </div>
    );
};

export default FriendsSection;