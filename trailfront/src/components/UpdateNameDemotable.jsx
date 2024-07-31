import React, { useState } from 'react';

function UpdateNameDemotable() {
    const [oldName, setOldName] = useState('');
    const [newName, setNewName] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:65535/update-name-demotable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ oldName, newName })
            });

            const responseData = await response.json();

            if (responseData.success) {
                setMessage("Name updated successfully!");
                // You might want to trigger a re-fetch of the table data here
            } else {
                setMessage("Error updating name!");
            }
        } catch (error) {
            setMessage("Error updating name!");
        }
    }

    return (
        <div>
            <h2>Update Name in DemoTable</h2>
            <p>The values are case sensitive and if you enter in the wrong case, the update statement will not do anything.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="updateOldName">Old Name: </label>
                    <input
                        type="text"
                        id="updateOldName"
                        value={oldName}
                        onChange={(e) => setOldName(e.target.value)}
                        placeholder="Enter Old Name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="updateNewName">New Name: </label>
                    <input
                        type="text"
                        id="updateNewName"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter New Name"
                        maxLength="20"
                    />
                </div>
                <button type="submit">update</button>
            </form>
            <div>{message}</div>
        </div>
    );
}

export default UpdateNameDemotable;