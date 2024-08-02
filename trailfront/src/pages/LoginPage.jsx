import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import { useGoogleLogin } from '@react-oauth/google';

function LoginPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authMode, setAuthMode] = useState("Log In");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:65535/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token);
                navigate('/profile');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    async function handleSignUp(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:65535/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setAuthMode("Log In");
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch('http://localhost:65535/auth/google-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                });
                const data = await response.json();
                if (response.ok) {
                    login(data.token);
                    navigate('/profile');
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        onError: () => {
            console.error('Google Login Failed');
        },
    });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const toggleAuthMode = () => {
        setAuthMode(authMode === "Log In" ? "Sign Up" : "Log In");
        setShowPassword(false);
    };

    return (
        <>
            <div className="auth-container">
                {authMode === "Log In" && (
                    <>
                        <h1>Log In</h1>
                        <form onSubmit={handleLogin}>
                            <div className="input-container">
                                <input type="email" name="email" required autoComplete="off" placeholder=""
                                       onChange={(e) => setEmail(e.target.value)}/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-container">
                                <input type={showPassword ? "text" : "password"} name="password" required
                                       autoComplete="off" placeholder="" onChange={(e) => setPassword(e.target.value)}/>
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="show-password">
                                <input type="checkbox" name="showPassword" checked={showPassword}
                                       onChange={toggleShowPassword}/>
                                <span className="checkbox" onClick={toggleShowPassword}></span>
                                <label htmlFor="showPassword">Show Password</label>
                            </div>
                            <button type="submit">Log In</button>
                        </form>
                        <div className="auth-mode">
                            <p>New to TrailFinder?</p>
                            <a onClick={toggleAuthMode}>Sign Up</a>
                        </div>
                        <button onClick={() => googleLogin()} className="google-login-button">
                            Login with Google
                        </button>
                    </>
                )}

                {authMode === "Sign Up" && (
                    <>
                        <h1>Sign Up</h1>
                        <form onSubmit={handleSignUp}>
                            <div className="input-container">
                                <input type="text" name="name" required autoComplete="off" placeholder=""
                                       onChange={(e) => setName(e.target.value)}/>
                                <label htmlFor="name">Full Name</label>
                            </div>
                            <div className="input-container">
                                <input type="email" name="email" required autoComplete="off" placeholder=""
                                       onChange={(e) => setEmail(e.target.value)}/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-container">
                                <input type={showPassword ? "text" : "password"} name="password" required
                                       autoComplete="off" placeholder="" onChange={(e) => setPassword(e.target.value)}/>
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="show-password">
                                <input type="checkbox" name="showPassword" checked={showPassword}
                                       onChange={toggleShowPassword}/>
                                <span className="checkbox" onClick={toggleShowPassword}></span>
                                <label htmlFor="showPassword">Show Password</label>
                            </div>
                            <button type="submit">Sign Up</button>
                        </form>
                        <div className="auth-mode">
                            <p>Already on TrailFinder?</p>
                            <a onClick={toggleAuthMode}>Log In</a>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default LoginPage;