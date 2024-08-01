import { useState, useEffect } from 'react'
import Auth from './assets/Auth'
import TrailWidget from './assets/TrailWidget'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import DatabaseStatus from './components/DatabaseStatus';
import DemotableDisplay from './components/DemotableDisplay';
import ResetDemotable from './components/ResetDemotable';
import InsertDemotable from './components/InsertDemotable';
import UpdateNameDemotable from './components/UpdateNameDemotable';
import CountDemotable from './components/CountDemotable';

function App() {
  const [userID, setUserID] = useState(null);
  const [status, setStatus] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch('http://localhost:65535/check-db-connection', {
          mode: "cors"
        });
        const text = await response.text();
        setStatus(text);
        setConnected(true);
      } catch (err) {
        setStatus('connection timed out');
      }
    }

    checkConnection();
  }, []);

  useEffect(() => {
    async function initializeDB() {
      if (connected) {
        await fetch("http://localhost:65535/initialize", {
          method: 'POST'
        });
      }
    }

    // initializeDB();
  }, [connected]);

  return (
    <>
      {/*<AuthProvider>*/}
        <Router>
          <Routes>
            <Route path="/login" element={<InsertDemotable />} />
            <Route path="/register" element={<InsertDemotable />} />
            {/*<PrivateRoute path="/profile" element={<InsertDemotable />} />*/}
            <Route path="*" element={<Navigate to="/profile" />} />
          </Routes>
        </Router>
      {/*</AuthProvider>*/}
      <header>
        <div className="logo">
          <img src="trailfinder.png" alt="TrailFinder" draggable="false" />
          <h1>TrailFinder</h1>
        </div>
        <span>{status}</span>
      </header>
      <main>
        {userID === null && <Auth setUserID={setUserID} />}
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
