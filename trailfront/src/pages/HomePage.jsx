import React, { useState, useEffect } from 'react';
import TrailWidget from '../components/TrailWidget.jsx';

function HomePage() {
    const [trails, setTrails] = useState([]);
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
                setError(data.error || 'Failed to fetch trails');
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
                setError(data.error || 'Failed to fetch trails');
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
                <div class="filter">
                    <button class="filter-button">Filter</button>
                    <div class="filter-content">
                        <label><input type="checkbox" value="easy" />Easy</label>
                        <label><input type="checkbox" value="medium" />Medium</label>
                        <label><input type="checkbox" value="hard" />Hard</label>
                    </div>
                </div>
                <button className="search-button">Search</button>
            </div>
            <div className="trailwidgets">
                {trails.map(trail => (
                    <TrailWidget trail={trail} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
