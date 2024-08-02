import { useState, useEffect } from 'react'
import Auth from './assets/Auth'
import TrailWidget from './assets/TrailWidget'
import './App.css'
import {BrowserRouter as Router, Route, Routes, Navigate, Outlet} from 'react-router-dom';
import { AuthProvider, useAuth } from './assets/AuthContext.jsx';

import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from "./pages/ProfilePage.jsx";



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

    //use this code to initialize the DB on tunnel connection success
    // initializeDB();
  }, [status]);

  return (
    <>
      <header>
        <div className="logo">
          <img src="trailfinder.png" alt="TrailFinder" draggable="false" />
          <h1>TrailFinder</h1>
        </div>
        <span>{status}</span>
      </header>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
      <main>
        {userID !== null &&
          <div className="trailwidgets">
            <TrailWidget trailname="Mountain Trail" difficulty="Medium" preview="./trailfinder.png" />
            <TrailWidget trailname="Lakeside Path" difficulty="Easy" preview="./trailfinder.png" />
            <TrailWidget trailname="Forest Adventure" difficulty="Hard" preview="./trailfinder.png" />
          </div>
        }
      </main>
    </>
  )
}

export default App
