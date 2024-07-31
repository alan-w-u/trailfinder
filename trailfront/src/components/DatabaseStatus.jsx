import React, { useState, useEffect } from 'react';

function DatabaseStatus() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkDbConnection() {
            try {
                const response = await fetch('http://localhost:65535/check-db-connection');
                const text = await response.text();
                setStatus(text);
            } catch (error) {
                setStatus('connection timed out');
            } finally {
                setLoading(false);
            }
        }

        checkDbConnection();
    }, []);

    return (
        <h1>
            Database Connection Status:
            {loading ? (
                <img src="loading_100px.gif" alt="Loading..." />
            ) : (
                <span>{status}</span>
            )}
        </h1>
    );
}

export default DatabaseStatus;