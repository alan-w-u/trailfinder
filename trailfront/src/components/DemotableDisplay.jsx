import React, { useState, useEffect } from 'react';

function DemotableDisplay() {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchTableData();
    }, []);

    async function fetchTableData() {
        try {
            const response = await fetch('http://localhost:65535/demotable');
            const responseData = await response.json();
            setTableData(responseData.data);
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    }

    return (
        <div>
            <h2>Show Demotable</h2>
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {tableData.map((row, index) => (
                    <tr key={index}>
                        {row.map((field, fieldIndex) => (
                            <td key={fieldIndex}>{field}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DemotableDisplay;