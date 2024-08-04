import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css'

function TrailWidget(props) {
    const [locationname, setLocationname] = useState('Yosemite National Park');
    const [latitude, setLatitude] = useState(37.865100);
    const [longitude, setLongitude] = useState(-119.538300);
    const [trailname, setTrailname] = useState('Half Dome Trail');
    const [trail, setTrail] = useState(null);
    const navigate = useNavigate();

    const handleTrailWidgetClick = () => {
        navigate('/trail', { state: { locationname: locationname, latitude: latitude, longitude: longitude, trailname: trailname } });
    };

    return (
        <div className="trailwidget" onClick={handleTrailWidgetClick}>
            <img src={props.preview} alt="trail image" />
            <h1>{props.trailname}</h1>
            <p>Difficulty: {props.difficulty}</p>
        </div>
    );
}

export default TrailWidget
