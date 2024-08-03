import { useState, useEffect } from 'react'
import Auth from './components/Auth.jsx'
import TrailWidget from './components/TrailWidget.jsx'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';

import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from "./pages/ProfilePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";



const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
    const [userID, setUserID] = useState(null);
    const [status, setStatus] = useState('');


    useEffect(() => {
        async function checkConnection() {
            try {
                const response = await fetch('http://localhost:65535/check-db-connection', {
                    mode: "cors"
                });
                const text = await response.text();
                setStatus(text);
            } catch (err) {
                setStatus('connection timed out');
            }
        }

        checkConnection();
    }, []);

    useEffect(() => {
        async function initializeDB() {
            if (status) {
                await fetch("http://localhost:65535/initialize", {
                    method: 'POST'
                });
            }
        }

        initializeDB(); // Use this code to initialize the DB on tunnel connection success
    }, [status]);

    return (
        <>
            <AuthProvider>
                <Router>
                    <Navbar status={status} />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>
                        <Route element={<PrivateRoute />}>
                            <Route path="/home" element={<HomePage />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </>
    )
}

export default App
