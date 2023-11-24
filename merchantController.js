const router = require("express").Router();
var dbConnection = require('./dbCon');

router.get('/', (req, res) => {
    console.log('GET request received at merchant get route');
    // Use a SELECT query to retrieve data from the User table
    dbConnection.query('SELECT * FROM Merchant', (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from Merchant table');
            res.status(200).json(results); 
        }
    });
});

// Define a route to handle POST requests for data insertion
router.post('/', (req, res) => {
    console.log('POST request received at Create merchant route'); 
    // Use the data from the request body
    const { businessName, businessDesc, businessLicenseNumber, userId } = req.body;
    const userData = req.body;
    console.log('Data to be inserted:', userData); // Log to check the data being used for the insertion
    var query = `Insert into Merchant (BusinessName, BusinessDescription, BusinessLicenseNumber, User_ID) 
    values ('${businessName}','${businessDesc}','${businessLicenseNumber}', ${userId})`;
    dbConnection.query(query, userData, (error, results) => {
        if (error) {
            console.error('Error inserting data: ' + error.message);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into Merchant table');
            res.status(200).send('Record added to the Merchant table');
        }
    });
});

module.exports = router;
