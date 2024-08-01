import {withOracleDB} from "../config/db.js";
import oracledb from "oracledb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loadEnvFile from '../utils/envUtil.js';

const envVariables = loadEnvFile('./.env');


async function registerUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await withOracleDB(async (connection)=> {
        const result = await connection.execute(
            `SELECT user_id_seq.NEXTVAL FROM DUAL`
        );
        const userID = result.rows[0][0];

        try {
            return await connection.execute(
                `INSERT INTO UserProfile (userID, name, email, password)
                 VALUES (:userID, :name, :email, :hashedPassword, 1)`,
                [userID, name, email, hashedPassword],
                {autoCommit: true}
            );
        } catch (err) {
            console.log(err.message);
        }
    })
}

async function loginUser(email, password) {
    return await withOracleDB(async (connection)=> {
        return await connection.execute(
            `SELECT * FROM UserProfile WHERE email = :email`,
            {email},
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
    });
}

async function googleLogin(token, client) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: envVariables["GOOGLE_CLIENTID"],
    });
    const { name, email, sub: googleId } = ticket.getPayload();

    return await withOracleDB(async (connection)=> {
        let result = await connection.execute(
            `SELECT *
             FROM UserProfile
             WHERE googleId = :googleId`,
            {googleId},
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );

        if (result.rows.length === 0) {
            // Create new user
            await connection.execute(
                `INSERT INTO UserProfile (name, email, googleId)
                 VALUES (:name, :email, :googleId)`,
                {name, email, googleId},
                {autoCommit: true}
            );
            result = await connection.execute(
                `SELECT *
                 FROM UserProfile
                 WHERE googleId = :googleId`,
                {googleId},
                {outFormat: oracledb.OUT_FORMAT_OBJECT}
            );
        }

        const user = result.rows[0];
        return jwt.sign({userId: user.USERID}, envVariables.JWT_SECRET, {expiresIn: '1h'});
    });
}

async function getProfile(userID) {
    return await withOracleDB(async (connection)=> {
        const result = await connection.execute(
            `SELECT userID, name, email, trailsHiked, experienceLevel, numberOfFriends
             FROM UserProfile
             WHERE userID = :userId`,
            {userId: userID},
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );

        if (result.rows.length > 0) {
            return result.rows[0];
        }
    });
}

async function updateProfile(name, trailsHiked, experienceLevel, userID) {

    return await withOracleDB( async (connection) => {
        await connection.execute(
            `UPDATE UserProfile SET name = :name, trailsHiked = :trailsHiked, experienceLevel = :experienceLevel WHERE userID = :userId`,
            { name, trailsHiked, experienceLevel, userId: userID },
            { autoCommit: true }
        );

        return true;
    });
}

export {
    registerUser,
    loginUser,
    googleLogin,
    getProfile,
    updateProfile
}