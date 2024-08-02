import React from 'react';
import {useNavigate} from "react-router-dom";

// Define a functional component for the Navbar
const Navbar = ({ status }) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/home');
    };

    return (
        <header>
            <div className="logo">
                <img
                    src="trailfinder.png"
                    alt="TrailFinder"
                    draggable="false"
                    style={{ cursor: 'pointer' }}
                    onClick={handleLogoClick}
                />
                <h1 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    TrailFinder
                </h1>
            </div>
            <span>{status}</span>
        </header>
    );
};

export default Navbar;
