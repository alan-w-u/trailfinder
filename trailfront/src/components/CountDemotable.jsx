import React, { useState } from 'react';

function CountDemotable() {
    const [count, setCount] = useState(null);

    async function handleCount() {
        try {
            const response = await fetch("http://localhost:65535/count-demotable");
            const responseData = await response.json();

            if (responseData.success) {
                setCount(responseData.count);
            } else {
                setCount("Error in count demotable!");
            }
        } catch (error) {
            setCount("Error in count demotable!");
        }
    }

    return (
        <div>
            <h2>Count the Tuples in DemoTable</h2>
            <button onClick={handleCount}>count</button>
            <div>
                {count !== null && `The number of tuples in demotable: ${count}`}
            </div>
        </div>
    );
}

export default CountDemotable;