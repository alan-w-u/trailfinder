import React, { useState, useEffect } from 'react';
import TrailWidget from '../components/TrailWidget.jsx';

function HomePage() {
    const [trails, setTrails] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState('');
    const [debounce, setDebounce] = useState(searchText);

    const fetchTrails = async () => {
        try {
            const response = await fetch('http://localhost:65535/trails', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setTrails(data.trails);
            } else {
                setError(data.error || 'Failed to fetch Trails');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const fetchSelectionTrails = async () => {
        try {
            const response = await fetch(`http://localhost:65535/selection-trails?search=${searchText}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setTrails(data.trails);
            } else {
                setError(data.error || 'Failed to fetch Trails');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const fetchPreviews = async () => {
        try {
            const response = await fetch(`http://localhost:65535/previews?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}&trailname=${trailname}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setPreviews(data.previews);
            } else {
                setError(data.error || 'Failed to fetch Previews');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    useEffect(() => {
        fetchTrails();
        fetchPreviews();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounce(searchText);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchText]);

    useEffect(() => {
        if (debounce) {
            fetchSelectionTrails();
        }
    }, [debounce]);

    return (
        <div className="home-page">
            <div className="welcome">
                <h1>Welcome to TrailFinder</h1>
                <p>Discover and explore amazing trails near you!</p>
            </div>
            <div className="search">
                <input type="text" className="searchbar" placeholder="Search" onChange={handleSearch} />
                {/* <div class="filter">
                    <button class="filter-button">Difficulty</button>
                    <div class="filter-content">
                        <label><input type="checkbox" value="1" /> 1</label>
                        <label><input type="checkbox" value="2" /> 2</label>
                        <label><input type="checkbox" value="3" /> 3</label>
                        <label><input type="checkbox" value="4" /> 4</label>
                        <label><input type="checkbox" value="5" /> 5</label>
                    </div>
                </div> */}
                {/* <button className="search-button">Search</button> */}
            </div>
            <div className="trailwidgets">
                {trails.map(trail => (
                    <TrailWidget trail={trail} preview={previews[0]} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
