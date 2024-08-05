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

// Get all trail information
router.get('/trails', async (req, res) => {
    const trailsResult = await dataService.getTrails();
    if (trailsResult) {
        console.log('Trails GET success - 200');
        res.json({ success: true, trails: trailsResult });
    } else {
        res.status(500).json({ success: false, error: 'Failed to GET Trails' })
    }
});

// Get specific trail information
router.get('/trail', async (req, res) => {
    const trailResult = await dataService.getTrail();
    if (trailResult) {
        console.log('Trail GET success - 200');
        res.json({ success: true, trail: trailResult });
    } else {
        res.status(500).json({ success: false, error: 'Failed to GET Trail' })
    }
});

// Select tuples from trail with specific name
router.get('/selection-trails', async (req, res) => {
    const { search } = req.query;
    return await dataService.selectionTrails(JSON.parse(decodeURIComponent(search))).then((trailsResult)=> {
        console.log('Select Trails Success - 200')
        res.json({ success: true, trails: trailsResult });
    }).catch ((e)=> {
        res.status(500).json({ success: false, error: e.message });
    });
});

// Get trail preview information
router.get('/previews', async (req, res) => {
    const { locationname, latitude, longitude, trailname } = req.query;
    const previewsResult = await dataService.getPreviews(locationname, latitude, longitude, trailname);
    if (previewsResult) {
        console.log('Previews GET success - 200');
        res.json({ success: true, previews: previewsResult });
    } else {
        res.status(500).json({ success: false, error: 'Failed to GET Previews' })
    }
});

// Get transportation information
router.get('/transportation', async (req, res) => {
    const { locationname, latitude, longitude } = req.query;
    const transportationResult = await dataService.getTransportation(locationname, latitude, longitude);
    if (transportationResult) {
        console.log('Transportation GET success - 200');
        res.json({ success: true, transportation: transportationResult });
    } else {
        res.status(500).json({ success: false, error: 'Failed to GET Transportation' })
    }
});

// Get retailer and gear information
router.get('/retailer-gear', async (req, res) => {
    const { locationname, latitude, longitude, trailname } = req.query;
    const retailerGearResult = await dataService.getRetailerGear(locationname, latitude, longitude, trailname);
    if (retailerGearResult) {
        console.log('Retailer and Gear GET success - 200');
        res.json({ success: true, retailerGear: retailerGearResult });
    } else {
        res.status(500).json({ success: false, error: 'Failed to GET Retailer or Gear' })
    }
});

// Get user-generated content information
router.get('/ugc', async (req, res) => {
    const { locationname, latitude, longitude, trailname } = req.query;
    const ugcResult = await dataService.getUGC(locationname, latitude, longitude, trailname);
    if (ugcResult) {
        console.log('UGC GET success - 200');
        res.json({ success: true, ugc: ugcResult });
    } else {
        res.status(500).json({ success: false, error: 'Failed to GET UGC' })
    }
});

router.get('/selectEquipment', async (req, res) => {
    const { whereClause } = req.body;
    const result = await dataService.selectionEquipment(whereClause);
    console.log(result);
    if (result === -1) {
        res.status(500).json({ success: false, error: 'whereClause Invalid or No Rows Exist' });
    } else {
        res.json({ success: true, data: result });
    }
});

// Project attributes from trail
router.get('/projectTrailAttributes', async (req, res) => {
    const { projectionString } = req.body;
    const result = await dataService.projectTrailAttributes(projectionString);
    if (result === -1) {
        res.status(500).json({ success: false, error: 'attributes Invalid or No Rows Exist' });
    } else {
        res.json({ success: true, data: result });
    }
})

// Join user ugc review
router.get("/join-user-ugc", async (req, res) => {
    const { locationname, latitude, longitude, trailname, rating } = req.query;
    const result = await dataService.joinUserUGC(locationname, latitude, longitude, trailname, rating);
    if (result === -1) {
        res.status(500).json({ success: false, error: 'attributes Invalid or No Rows Exist' });
    } else {
        console.log("Join UGC Review Success - 200");
        res.json({ success: true, ugc: result });
    }
})

//find heaviest equipment by type
router.get("/findHeaviestEquipmentByType", async (req, res) => {
    const result = await dataService.findHeaviestEquipmentType(); 
    if (result === -1) {
        res.status(500).json({ success: false, error: 'Error or No Rows Exist' });
    } else {
        res.json({ success: true, data: result });
    }
})

//find cheapest transport by type
router.get("/findCheapestTransportByType", async (req, res) => {
    const result = await dataService.findCheapestTransportPerType(); 
    if (result === -1) {
        res.status(500).json({ success: false, error: 'Error or No Rows Exist' });
    } else {
        res.json({ success: true, data: result });
    }
})

//find users no equipment
router.get("/findUsersWithoutEquipment", async (req, res) => {
    const result = await dataService.findUsersWithoutEquipment(); 
    if (result === -1) {
        res.status(500).json({ success: false, error: 'Error or No Rows Exist' });
    } else {
        res.json({ success: true, data: result });
    }
})

export default router;