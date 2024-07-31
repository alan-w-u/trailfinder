import React, { useState } from 'react';

function ResetDemotable() {
    const [message, setMessage] = useState('');

    async function handleReset() {
        try {
            const response = await fetch("http://localhost:65535/initiate-demotable", {
                method: 'POST'
            });
            const responseData = await response.json();

            if (responseData.success) {
                setMessage("demotable initiated successfully!");
                // You might want to trigger a re-fetch of the table data here
            } else {
                setMessage("Error initiating table!");
            }
        } catch (error) {
            setMessage("Error initiating table!");
        }
    }

    return (
        <div>
            <h2>Reset Demotable</h2>
            <p>If you wish to reset the table press on the reset button. If this is the first time you're running this page, you MUST use reset</p>
            <button onClick={handleReset}>reset</button>
            <div>{message}</div>
        </div>
    );
}

export default ResetDemotable;