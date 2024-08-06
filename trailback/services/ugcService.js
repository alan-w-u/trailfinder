import { withOracleDB } from "../config/db.js";
import oracledb from "oracledb";
import loadEnvFile from "../utils/envUtil.js";


const envVariables = loadEnvFile('./.env');


async function addReview(message, rating, location, lat, lon, trail, userID) {
    return await withOracleDB(async (connection) => {
        const currentDate = new Date().toISOString().split('T')[0];

        const newUGCID = await connection.execute(
            `SELECT ugc_id_seq.NEXTVAL FROM DUAL`
        );
        const ugcid = newUGCID.rows[0][0];

        const ugcResult = await connection.execute(
            `INSERT INTO ugc (ugcid, userid, locationname, latitude, longitude, trailname, dateposted)
               VALUES (:ugcid, :curUserID, :location, :lat, :lon, :trail, TO_DATE(:currDate, \'YYYY-MM-DD\'))
               `,
            {
                ugcid: ugcid,
                curUserID: userID,
                location: location,
                lat: lat,
                lon: lon,
                trail: trail,
                currDate: currentDate,
            },
            { autoCommit: false }
        );

        await connection.execute(
            `INSERT INTO review (ugcid, rating, description)
                VALUES (:ugcid, :rating, :message)`,
            {
                ugcid: ugcid,
                rating: rating,
                message: message
            },
            { autoCommit: false }
        );

        await connection.execute(
            `INSERT INTO photo (ugcid, image)
                VALUES (:ugcid, EMPTY_BLOB())`,
            {
                ugcid: ugcid
            },
            { autoCommit: false }
        );


        await connection.commit();

        return { success: true };
    });
}


    async function deleteReview(ugcid) {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `DELETE FROM ugc WHERE ugcid = :ugcid`,
                { ugcid: ugcid },
                { autoCommit: true }
            );

            return { success: true };
        });
    }

export {
    addReview,
    deleteReview
}
