import { withOracleDB } from '../config/db.js';
import oracledb from 'oracledb';
import fs from 'fs';

async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// Run SQL file to create and populate tables
async function initializeDB() {
    try {
        const script = fs.readFileSync('./config/database.sql', 'utf-8');
        const statements = script.split(';').filter(statement => statement.trim());
        return await withOracleDB(async (connection) => {
            for (const statement of statements) {
                try {
                    await connection.execute(statement);
                } catch (err) {
                    console.log('Failed to run statement:', statement);
                }
            }
            console.log("Database.sql successfully initialized. ");
            return true;
        }).catch(() => {
            return false;
        })
    } catch (err) {
        console.log(`Failed to read or process SQL script: ${err}`);
    }
}

// Run SQL file to clear tables
async function clearDB() {
    try {
        const script = fs.readFileSync('./config/clear.sql', 'utf-8');
        const statements = script.split(';').filter(statement => statement.trim());
        return await withOracleDB(async (connection) => {
            for (const statement of statements) {
                try {
                    await connection.execute(statement);
                } catch (err) {
                    console.error('Failed to run statement:', statement);
                }
            }
            return true;
        }).catch(() => {
            return false;
        })
    } catch (err) {
        console.log('Failed to read or process SQL script');
    }
}

// Fetch table
async function fetchDB(relations, attributes, predicates) {
    return await withOracleDB(async (connection) => {
        const attributesStr = Array.isArray(attributes) ? attributes.join(', ') : attributes;
        const relationsStr = Array.isArray(relations) ? relations.join(', ') : relations;
        const predicatesStr = Array.isArray(predicates) ? predicates.join(' AND ') : predicates;
        const result = await connection.execute(
            `SELECT ${attributesStr} FROM ${relationsStr} WHERE ${predicatesStr}`,
            [],
            { autoCommit: true }
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Insert data into table
async function insertDB(relation, data) {
    return await withOracleDB(async (connection) => {
        const placeholders = data.map((_, index) => `:${index + 1}`).join(', ');
        const result = await connection.execute(
            `INSERT INTO ${relation} VALUES (${placeholders})`,
            data,
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Delete data in table
async function deleteDB(relation, predicates) {
    return await withOracleDB(async (connection) => {
        const predicatesStr = Array.isArray(predicates) ? predicates.join(' AND ') : predicates;
        const result = await connection.execute(
            `DELETE FROM ${relation} WHERE ${predicatesStr}`,
            [],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Count data in table
async function countDB(relation) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT COUNT (*) FROM ${relation}`);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

// Get all trail information
async function getTrails() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT locationname, 
                    latitude, 
                    longitude, 
                    trailname, 
                    TO_CHAR(timetocomplete, 'DD HH24:MI:SS') AS timetocomplete, 
                    description, 
                    hazards, 
                    difficulty
            FROM trail`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Trails not found");
            return [];
        }
    });
}

// Get specific trail information
async function getTrail(locationname, latitude, longitude, trailname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT locationname, 
                    latitude, 
                    longitude, 
                    trailname, 
                    TO_CHAR(timetocomplete, 'DD HH24:MI:SS') AS timetocomplete, 
                    description, 
                    hazards, 
                    difficulty
            FROM trail
            WHERE locationname = :locationname AND latitude = :latitude AND longitude = :longitude AND trailname = :trailname`,
            { locationname: locationname, latitude: latitude, longitude: longitude, trailname: trailname },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            console.log("Trail not found");
            return [];
        }
    });
}

// Project attributes from trail
async function projectTrailAttributes(attributes) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ${attributes} 
            FROM TRAIL`);
        return result.rows;
    }).catch(() => {
        return -1;
    })
}

// Select to see what equipment people are bringing
async function selectionEquipment(whereClause) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * 
            FROM EQUIPMENT 
            WHERE ${whereClause}`);
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

async function joinUserUGCReview(predicates, attributes) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ${attributes}
            FROM userprofile, ugc, review, trail 
            WHERE ${predicates}`);
        return result.rows;
    }).catch(() => {
        return -1;
    })
}

export {
    testOracleConnection,
    initializeDB,
    clearDB,
    fetchDB,
    insertDB,
    deleteDB,
    countDB,
    getTrails,
    getTrail,
    projectTrailAttributes, 
    selectionEquipment,
    joinUserUGCReview
};