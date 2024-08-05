import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Trail.css';

function TrailPage() {
    const location = useLocation();
    const { locationname, latitude, longitude, trailname, timetocomplete, description, hazards, difficulty } = location.state || {};

    return (
        <div className="trail-page">
            <div className="trail-info trail-title">
                <div className="left">
                    <h1>{trailname}</h1>
                </div>
                <div className="right">
                    <h2>{locationname}</h2>
                    <b>{latitude}° {latitude >= 0 ? 'N' : 'S'} {longitude}° {longitude >= 0 ? 'E' : 'W'}</b>
                </div>
            </div>
            <div className="previews">
                PREVIEWS
            </div>
            <div className="trail-info">
                <div className="left">
                    <b>Time to Complete <span>—</span> {timetocomplete} <span>(hrs:mins)</span></b>
                </div>
                <div className="right">
                    <b>Difficulty <span>—</span> {difficulty}</b>
                </div>
            </div>
            <div className="trail-info">
                <div className="description left">
                    <b>Description</b>
                    <p>&nbsp;</p>
                    <p>{description}</p>
                </div>
                <div className="hazards right">
                    <b>Hazards</b>
                    <p>&nbsp;</p>
                    <ul>
                        {hazards.split(',').map((hazard, index) => (
                            <li key={index}>{hazard.trim()}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="trail-info">
                <div className="equipment">
                    <b>Recommended Gear</b>
                    <p>&nbsp;</p> {/* spacer */}
                </div>
            </div>
            <div className="trail-info">
                <div className="reviews">
                    <b>Reviews</b>
                    <p>&nbsp;</p> {/* spacer */}
                </div>
            </div>
        </div>
    );
}

export default TrailPage;
