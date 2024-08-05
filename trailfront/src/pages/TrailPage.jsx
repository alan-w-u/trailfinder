import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Trail.css';

function TrailPage() {
    const location = useLocation();
    const { locationname, latitude, longitude, trailname, timetocomplete, description, hazards, difficulty } = location.state || {};
    const [retailerGear, setRetailerGear] = useState([]);
    const [ugc, setUGC] = useState([]);

    const fetchRetailerGear = async () => {
        try {
            const response = await fetch(`http://localhost:65535/retailer-gear?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}&trailname=${trailname}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setRetailerGear(data.retailerGear);
            } else {
                setError(data.error || 'Failed to fetch retailers and gear');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const fetchUGC = async () => {
        try {
            const response = await fetch(`http://localhost:65535/ugc?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}&trailname=${trailname}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUGC(data.ugc);
            } else {
                setError(data.error || 'Failed to fetch ugc');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchRetailerGear();
        fetchUGC();
    }, []);

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
                    <b>Time to Complete<span> : {timetocomplete} (hrs:mins)</span></b>
                </div>
                <div className="right">
                    <b>Difficulty<span> : {difficulty}</span></b>
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
                            <li key={index}>
                                {hazard.trim()}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="trail-info">
                <div className="equipment">
                    <b>Recommended Gear</b>
                    <p>&nbsp;</p>
                    <ul>
                        {retailerGear.map((item, index) => (
                            <li key={index}>
                                <b>{item.GEARNAME}</b> ({item.GEARTYPE})
                                <p>&nbsp;</p>
                                <b><a href={item.PRODUCTWEBSITE}>{item.PRODUCTNAME}</a></b> — {item.RETAILERNAME}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="trail-info">
                <div className="reviews">
                    <b>Reviews</b>
                    <p>&nbsp;</p>
                    {ugc.map((item, index) => (
                        <li key={index}>
                            <b>{item.NAME}</b>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            {item.RATING &&
                                <>
                                    <b>{item.RATING} ★</b>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </>
                            }
                            <b>{new Date(item.DATEPOSTED.split('T')[0]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</b>
                            {item.IMAGE &&
                                <>
                                    <p>&nbsp;</p>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    {item.IMAGE}
                                </>
                            }
                            {item.DESCRIPTION &&
                                <>
                                    <p>&nbsp;</p>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    {item.DESCRIPTION}
                                </>
                            }
                        </li>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TrailPage;
