import React, { useState, useEffect } from 'react';
import '../components/Trail.css'; // Make sure the path to your CSS file is correct

function TrailPage() {
    const [locationname, setLocationname] = useState('Yosemite National Park');
    const [latitude, setLatitude] = useState(37.865100);
    const [longitude, setLongitude] = useState(-119.538300);
    const [trailname, setTrailname] = useState('Half Dome Trail');
    const [trail, setTrail] = useState(null);

    useEffect(() => {
        const fetchTrail = async () => {
            try {
                const response = await fetch(`http://localhost:65535/auth/trail?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}&trailname=${trailname}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setTrail(data.trail);
                } else {
                    setError(data.error || 'Failed to fetch trail');
                }
            } catch (error) {
                setError('Network error: ' + error.message);
            }
        };
    
        fetchTrail();
    }, []);    

    return (
        <div className="trail-page">
            <div className="previews">
                PREVIEWS
            </div>
            <div className="trail-info">
                <div className="details left">
                    <p>Time to Complete:</p>
                </div>
                <div className="details right">
                    <p>Difficulty:</p>
                </div>
            </div>
            <div className="trail-info">
                <div className="description left">
                    <b>Description</b>
                </div>
                <div className="hazards right">
                    <b>Hazards</b>
                </div>
            </div>
            <div className="trail-info">
                <div className="equipment">
                    <b>Recommended Equipment</b>
                </div>
            </div>
        </div>
    );
}

export default TrailPage;
