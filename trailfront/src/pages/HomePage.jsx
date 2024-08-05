import React, { useState, useEffect } from 'react';
import TrailWidget from '../components/TrailWidget.jsx';

function HomePage() {
    const [trails, setTrails] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState('');

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

    const parseSearchQuery = (query) => {
        const conditions = query.split(/\s*(&&|\|\|)\s*/);
        return conditions.map(condition => {
            if (condition === '&&' || condition === '||') return condition;
            const [field, operator, value] = condition.split(/\s*([=<>!]+)\s*/);
            return { field: field.trim(), operator: operator.trim(), value: value.replace(/['"]/g, '').trim() };
        });
    };

    const fetchSelectionTrails = async () => {
        setError('');
        if (!searchText) return await fetchTrails();
        try {
            const parsedQuery = parseSearchQuery(searchText);
            const queryString = encodeURIComponent(JSON.stringify(parsedQuery));
            const response = await fetch(`http://localhost:65535/selection-trails?search=${queryString}`, {
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
            setError('Query Error: ' + error.message);
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
            // setError('Network error: ' + error.message);
        }
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    useEffect(() => {
        fetchTrails();
        fetchPreviews();
    }, []);

    if (!trails) return <div> No Trails Found (Or Loading)... </div>;

    return (
        <div className="home-page">
            <div className="welcome">
                <h1>Welcome to TrailFinder</h1>
                <p>Discover and explore amazing trails near you!</p>
            </div>
            <div className="search">
                <input
                    type="text"
                    className="searchbar"
                    placeholder="Enter search query (e.g., hours <= 6 && difficulty = 4)"
                    value={searchText}
                    onChange={handleSearch}
                />
                {/* <div className="filter">
                    <button className="filter-button">Difficulty</button>
                    <div className="filter-content">
                        <label><input type="checkbox" value="1" /> 1</label>
                        <label><input type="checkbox" value="2" /> 2</label>
                        <label><input type="checkbox" value="3" /> 3</label>
                        <label><input type="checkbox" value="4" /> 4</label>
                        <label><input type="checkbox" value="5" /> 5</label>
                    </div>
                </div> */}
                <button className="search-button" onClick={fetchSelectionTrails}>Search</button>
            </div>
            {/*<div>*/}
            {/*    <p>*/}
            {/*        Search using conditions based on trail attributes:*/}
            {/*        <ul>*/}
            {/*            <li>locationname: e.g., locationname = "Yosemite National Park"</li>*/}
            {/*            <li>description: e.g., description LIKE "%scenic%"</li>*/}
            {/*            <li>hazards: e.g., hazards LIKE "%bears%"</li>*/}
            {/*        </ul>*/}
            {/*        Use && for AND, || for OR, and less/greater than operators for numeric inequality search.*/}
            {/*    </p>*/}
            {/*</div>*/}
            {error && <div>{(error.startsWith("ORA"))?"Invalid Query":error}</div>}
            <div className="trailwidgets">
                {trails && trails.map(trail => (
                    <TrailWidget key={trail.TRAILNAME} trail={trail} preview={previews[0]}/>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
