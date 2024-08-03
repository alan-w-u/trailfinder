import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from "../components/Login.jsx";
import SignUp from "../components/SignUp.jsx";

function LoginPage() {
    const [authMode, setAuthMode] = useState("Log In");

    const toggleAuthMode = () => {
        setAuthMode(authMode === "Log In" ? "Sign Up" : "Log In");
        // setShowPassword(false);
    };

    return (
        <>
            <div className="auth-container">
                {authMode === "Log In" && <Login/>}
                {authMode === "Sign Up" && <SignUp setAuthMode={setAuthMode}/>}
                <div className="auth-mode">
                    <p>New to TrailFinder?</p>
                    <a onClick={toggleAuthMode}>{authMode === "Log In" ? "Sign Up" : "Log In"}</a>
                </div>
            </div>
        </>
    );
}

export default LoginPage;