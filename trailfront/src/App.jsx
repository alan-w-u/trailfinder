import { useState, useEffect } from 'react'
import Auth from './assets/Auth'
import TrailWidget from './assets/TrailWidget'
import './App.css'

import DatabaseStatus from './components/DatabaseStatus';
import DemotableDisplay from './components/DemotableDisplay';
import ResetDemotable from './components/ResetDemotable';
import InsertDemotable from './components/InsertDemotable';
import UpdateNameDemotable from './components/UpdateNameDemotable';
import CountDemotable from './components/CountDemotable';

function App() {
  const [userID, setUserID] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch('http://localhost:65535/check-db-connection');
        const text = await response.text();
        setStatus(text);
      } catch (err) {
        setStatus('connection timed out');
      }
    }

    checkConnection();
  }, []);

  return (
    <>
      <header>
        <div className="logo">
          <img src="trailfinder.png" alt="TrailFinder" draggable="false" />
          <h1>TrailFinder</h1>
        </div>
        <span>{status}</span>
      </header>
      <main>
        <div className="App">
          <DatabaseStatus />
          <hr />
          <DemotableDisplay />
          <hr />
          <ResetDemotable />
          <hr />
          <InsertDemotable />
          <hr />
          <UpdateNameDemotable />
          <hr />
          <CountDemotable />
        </div>
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
