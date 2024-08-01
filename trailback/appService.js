import oracledb from 'oracledb';
import loadEnvFile from './utils/envUtil.js';
import fs from 'fs';

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// Initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        initializeDB();
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations

// Test connection to Oracle database
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
        const script = fs.readFileSync('./database.sql', 'utf-8');
        const statements = script.split(';').filter(statement => statement.trim());
        return await withOracleDB(async (connection) => {
            for (const statement of statements) {
                try {
                    await connection.execute(statement);
                } catch (err) {
                    console.log('Failed to run statement:', statement);
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

// Run SQL file to clear tables
async function clearDB() {
    try {
        const script = fs.readFileSync('./clear.sql', 'utf-8');
        const statements = script.split(';').filter(statement => statement.trim());
        return await withOracleDB(async (connection) => {
            for (const statement of statements) {
                try {
                    await connection.execute(statement);
                } catch (err) {
                    console.log('Failed to run statement:', statement);
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

export {
    testOracleConnection,
    initializeDB,
    clearDB,
    fetchDB,
    insertDB,
    deleteDB,
    countDB
};
