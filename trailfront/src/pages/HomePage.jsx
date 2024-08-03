import React from 'react';
import TrailWidget from "../components/TrailWidget.jsx";

function Home() {
    return (
        <div className="home-page">
            <div className="welcome">
                <h1>Welcome to TrailFinder</h1>
                <p>Discover and explore amazing trails near you!</p>
            </div>
            <div className="trailwidgets">
                <TrailWidget trailname="Mountain Trail" difficulty="Medium" preview="./trailfinder.png" />
                <TrailWidget trailname="Lakeside Path" difficulty="Easy" preview="./trailfinder.png" />
                <TrailWidget trailname="Forest Adventure" difficulty="Hard" preview="./trailfinder.png" />
            </div>
        </div>
    );
}

export default Home;
