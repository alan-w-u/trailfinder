import {foreignKeyUpdates as userqueries, withOracleDB} from "../config/db.js";
import oracledb from "oracledb";
import axios from "axios";
import jwt from "jsonwebtoken";
import loadEnvFile from "../utils/envUtil.js";

const envVariables = loadEnvFile('./.env');


async function getProfile(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT userID, name, email, trailsHiked, experienceLevel, numberOfFriends, profilepicture
             FROM userprofile
             WHERE userID = :userId`,
            { userId: userID },
            { outFormat: oracledb.OUT_FORMAT_OBJECT, fetchInfo: { "PROFILEPICTURE": { type: oracledb.BUFFER } } }
        );

        if (result.rows.length > 0) {
            const profile = result.rows[0];
            if (profile.PROFILEPICTURE) {
                profile.PROFILEPICTURE = profile.PROFILEPICTURE.toString('base64');
            }
            return profile;
        }
        console.error("User not found");
    });
}

async function updateProfile(name, email, profilePictureUrl, userID) {
    return await withOracleDB(async (connection) => {
        // Check if the new email already exists
        if (email) {
            const emailCheck = await connection.execute(
                `SELECT * FROM userprofile WHERE email = :email AND userID != :userID`,
                { email, userID },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            if (emailCheck.rows.length > 0) {
                throw new Error("Email already in use");
            }
        }

        const sameEmail = await connection.execute(
            `SELECT * FROM userprofile WHERE email = :email AND userID = :userID`,
            { email, userID },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        let newUserID = userID;
        let newToken = null;

        // Fetch profile picture if URL is provided
        let imageBuffer = null;
        if (profilePictureUrl) {
            try {
                const response = await axios.get(profilePictureUrl, { responseType: 'arraybuffer' });
                imageBuffer = response.data;
            } catch (error) {
                console.error("Error fetching profile picture:", error);
                throw new Error("Failed to fetch profile picture");
            }
        }

        // Prepare the update query
        let updateQuery = `UPDATE userprofile SET name = :name`;
        let params = { name, userID };

        if (imageBuffer) {
            updateQuery += `, profilepicture = :profilepicture`;
            params.profilepicture = { val: imageBuffer, type: oracledb.BLOB };
        }

        if (email && sameEmail.rows.length === 0) {
            // Generate new userID if email is being updated
            newUserID = await connection.execute(
                `SELECT user_id_seq.NEXTVAL FROM DUAL`
            );
            newUserID = newUserID.rows[0][0];

            for (let stmt of userqueries.disableConstraints) {
                await connection.execute(stmt.sql, {}, { autoCommit: true });
            }

            for (let stmt of userqueries.updates) {
                await connection.execute(stmt.sql, { newUserId: newUserID, oldUserId: userID }, { autoCommit: true });
            }

            for (let stmt of userqueries.enableConstraints) {
                await connection.execute(stmt.sql, {}, { autoCommit: true });
            }

            updateQuery += `, email = :email`;
            params.userID = newUserID;
            params.email = email;
            // Generate new JWT token
            newToken = jwt.sign({ userId: newUserID }, envVariables["JWT_SECRET"], { expiresIn: '1h' });
        }

        updateQuery += ` WHERE userID = :userID`;
        // Execute the update
        const result = await connection.execute(
            updateQuery,
            params,
            { autoCommit: true }
        );

        if (result.rowsAffected > 0) {
            return {
                message: "Profile updated successfully",
                ...(newToken && { newToken })
            };
        }
        throw new Error("Failed to update profile");
    });
}

async function getFriends(userid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT u.name, u.trailshiked, u.experiencelevel, u.profilepicture, f.datefriended
            FROM userprofile u
            JOIN friends f ON u.userid = f.friendid
            WHERE f.userid = :userid`,
            { userid: userid },
            { outFormat: oracledb.OUT_FORMAT_OBJECT, fetchInfo: { "PROFILEPICTURE": { type: oracledb.BUFFER } } }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("User has no friends.");
            return [];
        }
    });
}

export {
    getProfile,
    updateProfile,
    getFriends
}