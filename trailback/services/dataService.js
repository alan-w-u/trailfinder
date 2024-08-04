import fs from 'fs';
import { withOracleDB, initializeConnectionPool, closePoolAndExit } from '../config/db.js';

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

// select something from equipment to see what people are bringing
async function selectionEquipment(whereClause) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM EQUIPMENT WHERE ${whereClause}`);
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

//project attributes from trail
async function projectTrailAttributes(attributes) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT ${attributes} FROM TRAIL`);
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
    selectionEquipment,
    projectTrailAttributes, 
};
