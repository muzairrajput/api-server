var express = require('express');
var dbConnection = require('./dbCon');
var app = express();
app.use(express.json());

app.get('/healthcheck', function(req, res){
    res.status(200).json("API Service is running");
});

app.get('/merchant', (req, res) => {
    console.log('GET request received at merchant get route');
    // Use a SELECT query to retrieve data from the User table
    dbConnection.query('SELECT * FROM Merchant', (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from User table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});
// Define a route to handle POST requests for data insertion
app.post('/merchant', (req, res) => {
    console.log('POST request received at Create merchant route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const {businessName, businessDesc, businessLicenseNumber, userId} = req.body;
    const userData = req.body;
    console.log('Data to be inserted:', userData); // Log to check the data being used for the insertion
    var query = `Insert into Merchant (BusinessName, BusinessDescription, BusinessLicenseNumber, User_ID) 
    values ('${businessName}','${businessDesc}','${businessLicenseNumber}', ${userId})`;
    dbConnection.query(query, userData, (error, results) => {
        if (error) {
            console.error('Error inserting data: ' + error.message);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into User table');
            res.status(200).send('Record added to the User table');
        }
    });
});

app.get('/user', (req, res) => {
    console.log('GET request received at /retrieve route'); // Log to verify that the route handler is reached

    // Use a SELECT query to retrieve data from the User table
    dbConnection.query('SELECT * FROM User', (error, results) => {
        
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from User table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

// Define a route to handle POST requests for data insertion
app.post('/user', (req, res) => {
    console.log('POST request received at /create route'); // Log to verify that the route handler is reached

    // Use the data from the request body
    const userData = req.body;

    console.log('Data to be inserted:', userData); // Log to check the data being used for the insertion

    dbConnection.query('INSERT INTO User()', userData, (error, results) => {
        if (error) {
            console.error('Error inserting data: ' + error.message);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into User table');
            res.status(200).send('Record added to the User table');
        }
    });
});


app.listen(8083);