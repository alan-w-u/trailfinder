import React from 'react';

const FriendList = ({ friends }) => {
    return (
        <div className="friend-list">
            {friends.map(friend => (
                <div className="friend" key={friend.FRIENDID}>
                    <img className="friend-picture"
                         src={(friend.PROFILEPICTURE) ? `data:image/jpeg;base64,${friend.PROFILEPICTURE}`
                             : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                         alt="Profile"
                         onError={({ currentTarget }) => {
                             currentTarget.onerror = null;
                             currentTarget.src = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
                         }}
                    />
                    <p>
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
    );
};

export default FriendList;