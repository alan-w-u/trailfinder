import { useState } from 'react'
import Auth from './assets/Auth'
import './App.css'

function App() {
  const[userID, setUserID] = useState(null);

  return (
    <>
      <header>
        <div id="logo">
          <img src="trailfinder.png" alt="TrailFinder" draggable="false" />
          <h1>TrailFinder</h1>
        </div>
      </header>
      <main>
        {userID === null && <Auth setUserID={setUserID} />}
      </main>
    </>
  )
}

export default App
