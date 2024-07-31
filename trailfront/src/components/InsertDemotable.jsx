import React, { useState } from 'react';

function InsertDemotable() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:65535/insert-demotable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, name })
            });

            const responseData = await response.json();

            if (responseData.success) {
                setMessage("Data inserted successfully!");
                // You might want to trigger a re-fetch of the table data here
            } else {
                setMessage("Error inserting data!");
            }
        } catch (error) {
            setMessage("Error inserting data!");
        }
    }

    return (
        <div>
            <h2>Insert Values into DemoTable</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="insertId">ID: </label>
                    <input
                        type="number"
                        id="insertId"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Enter ID"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="insertName">Name: </label>
                    <input
                        type="text"
                        id="insertName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        maxLength="20"
                    />
                </div>
                <button type="submit">insert</button>
            </form>
            <div>{message}</div>
        </div>
    );
}

export default InsertDemotable;