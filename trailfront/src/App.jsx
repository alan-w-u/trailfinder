import React from 'react';
import DatabaseStatus from './components/DatabaseStatus';
import DemotableDisplay from './components/DemotableDisplay';
import ResetDemotable from './components/ResetDemotable';
import InsertDemotable from './components/InsertDemotable';
import UpdateNameDemotable from './components/UpdateNameDemotable';
import CountDemotable from './components/CountDemotable';

function App() {
    return (
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
    );
}

export default App;

// import { useState } from 'react'
// import Auth from './assets/Auth'
// import TrailWidget from './assets/TrailWidget'
// import './App.css'

// function App() {
//   const [userID, setUserID] = useState(null);

//   return (
//     <>
//       <header>
//         <div className="logo">
//           <img src="trailfinder.png" alt="TrailFinder" draggable="false" />
//           <h1>TrailFinder</h1>
//         </div>
//       </header>
//       <main>
//         {userID === null && <Auth setUserID={setUserID} />}
//         {userID != null &&
//           <div className="trailwidgets">
//             <TrailWidget trailname="Mountain Trail" difficulty="Medium" preview="./trailfinder.png" />
//             <TrailWidget trailname="Lakeside Path" difficulty="Easy" preview="./trailfinder.png" />
//             <TrailWidget trailname="Forest Adventure" difficulty="Hard" preview="./trailfinder.png" />
//           </div>
//         }
//       </main>
//     </>
//   )
// }

// export default App
