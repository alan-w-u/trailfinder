import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/ProjectionPage.css';


const SpecifyProjection = () => {

    const [tableName, setTableName] = useState("");
    const [tableAttributes, setTableAttributes] = useState("");

    async function submitForm(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:65535/projectAttributesAndTables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {

        }
    }


    return (
        <div className='projection-page'>
            <p>Welcome to our internal data! Please select a table of your choice, and the list of attributes you would like to see from that table.</p>
            <form>
                <label>
                    <input
                        type="text"
                        placeholder="Table Name"
                        onChange={(e) => setTableName(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="text"
                        placeholder="Table Attributes"
                        onChange={(e) => setTableAttributes(e.target.value)}
                    />
                </label>
                <button onSubmit={submitForm}>Submit</button>
            </form>
            <table>
                <tr>
                    <th>TableName</th>
                    <th>Attributes</th>
                </tr>
                <tr>
                    <td>USERPROFILE</td>
                    <td>userid, name, email, password, profilepicture, trailshiked, experienceLevel, numberoffriends</td>
                </tr>
                <tr>
                    <td>EQUIPMENT</td>
                    <td>equipmentid, userid, type, brand, amount, weight</td>
                </tr>
                <tr>
                    <td>TRANSPORTATION</td>
                    <td>transportid, type, transportcost</td>
                </tr>
                <tr>
                    <td>RETAILER1</td>
                    <td>retailername, retailerwebsite</td>
                </tr>
                <tr>
                    <td>RETAILER2</td>
                    <td>retailerid, retailername</td>
                </tr>
                <tr>
                    <td>LOCATION</td>
                    <td>locationname, latitude, longitude, weather</td>
                </tr>
                <tr>
                    <td>TRAIL</td>
                    <td>locationname, latitude, longitude, trailname, difficulty, timetocomplete, description, hazards</td>
                </tr>
                <tr>
                    <td>GEAR</td>
                    <td>geartype, gearname, locationname, latitude, longitude, trailname</td>
                </tr>
                <tr>
                    <td>PREVIEW1</td>
                    <td>previewid, image</td>
                </tr>
                <tr>
                    <td>PREVIEW2</td>
                    <td>locationname, latitude, longitude, trailname, previewid</td>
                </tr>
                <tr>
                    <td>UGC</td>
                    <td>ugcid, userid, locationname, latitude, longitude, trailname, dateposted</td>
                </tr>
                <tr>
                    <td>REVIEW</td>
                    <td>ugcid, rating, description</td>
                </tr>
                <tr>
                    <td>PHOTO</td>
                    <td>ugcid, image</td>
                </tr>
                <tr>
                    <td>FRIENDS</td>
                    <td>userid, friendid, datefriended</td>
                </tr>
                <tr>
                    <td>TRANSPORTATIONTOLOCATION</td>
                    <td>transportid, locationname, latitude, longitude, duration, tripcost</td>
                </tr>
                <tr>
                    <td>USERHIKESTRAIL</td>
                    <td>userid, locationname, latitude, longitude, trailname, datehiked, timetocomplete</td>
                </tr>
                <tr>
                    <td>RETAILERFEATURESGEAR</td>
                    <td>retailerid, gearname, productname, productwebsite</td>
                </tr>
            </table>
        </div>
    )
}

export default SpecifyProjection