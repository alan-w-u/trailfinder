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