import React from 'react';
import TrailWidget from "../components/TrailWidget.jsx";

function Home() {
    return (
        <div className="home-page">
            <h2>Welcome to TrailFinder</h2>
            <p>Find and explore amazing trails near you!</p>
            <div className="trailwidgets">
                <TrailWidget trailname="Mountain Trail" difficulty="Medium" preview="./trailfinder.png" />
                <TrailWidget trailname="Lakeside Path" difficulty="Easy" preview="./trailfinder.png" />
                <TrailWidget trailname="Forest Adventure" difficulty="Hard" preview="./trailfinder.png" />
            </div>
        </div>
    );
}

export default Home;
