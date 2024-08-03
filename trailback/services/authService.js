import { withOracleDB } from "../config/db.js";
import oracledb from "oracledb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loadEnvFile from '../utils/envUtil.js';
import axios from "axios";

const envVariables = loadEnvFile('./.env');

async function registerUser(name, email, password) {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * FROM userprofile WHERE email = :email`,
                { email },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            if (result.rows.length > 0) {
                const user = result.rows[0];
                if (user.PASSWORD) {
                    // User already exists with password
                    return;
                } else if (password) {
                    // User exists without password, update with new password
                    await connection.execute(
                        `UPDATE userprofile SET password = :hashedPassword WHERE email = :email`,
                        { hashedPassword, email },
                        { autoCommit: true }
                    );
                    return { message: "Password added to existing account" };
                }
            } else {
                // New user, create account
                await connection.execute(
                    `INSERT INTO userprofile (userID, name, email, password)
                     VALUES (user_id_seq.NEXTVAL, :name, :email, :hashedPassword)`,
                    [name, email, hashedPassword],
                    { autoCommit: true }
                );
                return { message: "User registered successfully" };
            }
        } catch (err) {
            console.error(err.message);
        }
    });
}

async function loginUser(email, password) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT TO_CHAR(userID) AS userID, 
            name, email, password, trailshiked, experiencelevel,profilepicture,numberoffriends 
            FROM userprofile WHERE email = :email`,
            { email },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (!user["PASSWORD"]) {
                return;
            }
            if (await bcrypt.compare(password, user["PASSWORD"])) {
                return jwt.sign({ userId: user["USERID"] }, envVariables["JWT_SECRET"], { expiresIn: '1h' });
            }
        }
        console.error("Invalid credentials");
    });
}

async function googleLogin(token) {
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const { email, name, sub: googleId } = googleResponse.data;

    return await withOracleDB(async (connection) => {
        let result = await connection.execute(
            `SELECT * FROM userprofile WHERE email = :email`,
            { email },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) {
            // Create new user
            await connection.execute(
                `INSERT INTO userprofile (userID, name, email)
                 VALUES (:googleId, :name, :email)`,
                { googleId, name, email },
                { autoCommit: true }
            );
        } else {
            const user = result.rows[0];
            if (user.USERID !== googleId) {
                // Update existing user with Google ID
                await connection.execute(
                    `UPDATE userprofile SET userID = :googleId WHERE email = :email`,
                    { googleId, email },
                    { autoCommit: true }
                );
            }
        }

        return jwt.sign({ userId: googleId }, envVariables["JWT_SECRET"], { expiresIn: '1h' });
    });
}

async function getProfile(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT userID, name, email, trailsHiked, experienceLevel, numberOfFriends
             FROM userprofile
             WHERE userID = :userId`,
            { userId: userID },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows[0];
        }
        console.error("User not found");
    });
}

async function updateProfile(name, trailsHiked, experienceLevel, userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE userprofile 
             SET name = :name, trailsHiked = :trailsHiked, experienceLevel = :experienceLevel 
             WHERE userID = :userId`,
            { name, trailsHiked, experienceLevel, userId: userID },
            { autoCommit: true }
        );

        if (result.rowsAffected > 0) {
            return { message: "Profile updated successfully" };
        }
        console.error("Failed to update profile");
    });
}

async function getFriends(userid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT userid, friendid, datefriended
            FROM friends
            WHERE userid = :userid`,
            { userid: userid },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        }
        console.error("Friends not found");
    });
}

export {
    registerUser,
    loginUser,
    googleLogin,
    getProfile,
    updateProfile,
    getFriends
}