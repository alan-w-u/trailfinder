import express from 'express';
import * as dataService from '../services/dataService.js';

const router = express.Router();

// ----------------------------------------------------------
// API endpoints

// Test connection to Oracle database
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await dataService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// Run SQL file to create and populate tables
router.post('/initialize', async (req, res) => {
    const initiateResult = await dataService.initializeDB();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to initialize' });
    }
});

// Fetch table
// example query URL: /fetch-db?relations=userprofile1&attributes=TrailsHiked&predicates=TrailsHiked%3E1
router.get('/fetch', async (req, res) => {
    const { relations, attributes, predicates } = req.query;
    if (!relations) {   // Fetch query requires target relation
        return res.status(400).json({ success: false, error: 'Table name (relation) is required' });
    }
    const relationsArr = Array.isArray(relations) ? relations : [relations];
    const attributesArr = Array.isArray(attributes) ? attributes : [attributes];
    const predicatesArr = Array.isArray(predicates) ? predicates : [predicates];
    const tableContent = await dataService.fetchDB(relationsArr, attributesArr, predicatesArr);
    res.json({ data: tableContent });
});

// Insert data into table
// example query: { 'relation': 'userprofile1', 'data': [5, 2] }
router.post('/insert', async (req, res) => {
    const { relation, data } = req.body;
    if (!relation) {    // Insert query requires target relation
        return res.status(400).json({ success: false, error: 'Table name (relation) is required' });
    }
    if (!Array.isArray(data)) {     // Inserted data has to be in array form
        return res.status(400).json({ success: false, error: 'Data must be an array' });
    }
    const insertResult = await dataService.insertDB(relation, data);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to insert' });
    }
});

// Delete data in table
// example query: { 'relation': 'userprofile1', 'predicates': ['TrailsHiked > 10'] }
router.delete('/delete', async (req, res) => {
    const { relation, predicates } = req.body;
    if (!predicates) {      // Delete query requires predicates
        return res.status(400).json({ success: false, error: 'Predicates are required' });
    }
    const predicatesArray = Array.isArray(predicates) ? predicates : [predicates];
    const deleteResult = await dataService.deleteDB(relation, predicatesArray);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to delete' });
    }
});

// Count data in table
// example query URL: /count?relation=userprofile1
router.get('/count', async (req, res) => {
    const { relation } = req.query;
    if (!relation) {    // Count query requires target relation
        return res.status(400).json({ success: false, error: 'Table name (relation) is required' });
    }
    const tableCount = await dataService.countDB(relation);
    if (tableCount >= 0) {
        res.json({ success: true, count: tableCount });
    } else {
        res.status(500).json({ success: false, error: 'Failed to count data' });
    }
});

router.get('/selectEquipment', async (req, res) => {
    const {whereClause} = req.body;
    const result = await dataService.selectionEquipment(whereClause);
    console.log(result);
    if (result === -1) {
        res.status(500).json({ success: false, error: 'whereClause Invalid or No Rows Exist' });
    } else {
        res.json({ success: true, data: result });
    }
});

//project trail aatributes
router.get('/projectTrailAttributes', async (req, res) => {
    const {projectionString} = req.body; 

    const result = await dataService.projectTrailAttributes(projectionString);
    if(result === -1) {
        res.status(500).json({ success: false, error: 'attributes Invalid or No Rows Exist' });
    } else {
        res.json({ success: true, data: result });
    }
})

export default router;
