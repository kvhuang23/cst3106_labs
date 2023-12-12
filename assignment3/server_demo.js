const express = require('express');
const { MongoClient, ObjectId, Timestamp } = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const port = 3001;
const atlasConnectionUri = 'your_mongodb_connection_string'; // Replace with your connection string
const dbName = 'Emergency_waitlist';

async function main() {
    const client = new MongoClient(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Successfully connected to the database.');

    const db = client.db(dbName);
    const triageCollection = db.collection('Patients');

    app.post('/addPatient', async (req, res) => {
        try {
            console.log('Received addPatient request:', req.body);
    
            // Validate the input
            if (!req.body.name || !req.body.code || !req.body.severity || req.body.waitTime === undefined) {
                console.error('Missing fields in request:', req.body);
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
    
            const newPatient = { name: req.body.name, code: req.body.code, severity: req.body.severity, waitTime: req.body.waitTime };
            console.log('Preparing to insert new patient:', newPatient);
    
            const result = await triageCollection.insertOne(newPatient);
            console.log('Insert operation result:', result);
    
            if (result.acknowledged) {
                console.log('Patient added successfully');
                res.json({ success: true });
            } else {
                console.error('Insert operation failed:', result);
                res.status(500).json({ error: 'Failed to add patient to triage' });
            }
        } catch (error) {
            console.error('Error on addPatient:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.get('/getTriageList', async (req, res) => {
        try {
            const triageList = await triageCollection.find().toArray();
            console.log('Triage List Retrieved:', triageList.length, 'records found');
            res.status(200).json(triageList);
        } catch (error) {
            console.error('Error on getTriageList:', error.message);
            // Providing a more user-friendly error message
            res.status(500).json({ error: 'Unable to retrieve triage list due to server error.' });
        }
    });
    
    app.get('/getPatientWaitTime', async (req, res) => {
        try {
            const patientName = req.query.name;
            if (!patientName) {
                console.error('Patient name not provided');
                res.status(400).json({ error: 'Patient name is required' });
                return;
            }
    
            const patient = await triageCollection.findOne({ name: patientName });
    
            if (!patient) {
                console.log(`Patient '${patientName}' not found`);
                res.status(404).json({ error: 'Patient not found' });
                return;
            }
    
            console.log(`Retrieved wait time for '${patientName}'`);
            res.status(200).json({ waitTime: patient.waitTime });
        } catch (error) {
            console.error('Error on getPatientWaitTime:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
    app.get('/', (req, res) => {
        res.send('Welcome to Emergency Room Triage');
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    process.on('SIGINT', () => {
        console.log('Closing database connection...');
        client.close();
        process.exit();
    });
}

main().catch(console.error);
