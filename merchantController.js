const router = require("express").Router();
var dbConnection = require('./dbCon');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    console.log('GET request received at merchant get route');
    // Use a SELECT query to retrieve data from the User table
    const { email, userId } = req.query;
    let sql = "SELECT * FROM Merchant WHERE 1=1";
    if (email) {
        sql += ` AND Email = '${email}'`;
    }
    if (userId) {
        sql += ` AND User_ID = ${userId}`;
    }
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data  gets retrieved from Merchant table');
            res.status(200).json(results);
        }
    });
});

// Define a route to handle POST requests for data insertion
router.post('/', (req, res) => {
    console.log('POST requests received at Create merchant route');
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
            res.status(200).send('Records added to the Merchant table');
        }
    });
});

// Define a route to handle POST requests for data insertion
router.post('/signup', (req, res) => {
    console.log('POST requests received at /signup route');

    const { Username, Password, Email, Address, Phone, BusinessName, BusinessDescription, BusinessLicenseNumber } = req.body;

    if (!Username || !Password || !Email || !Address || !Phone || !BusinessName || !BusinessDescription || !BusinessLicenseNumber) {
        return res.status(400).json({ error: 'All fields should be filled for successful signup.' });
    }

    // Hash the password
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    const hashedPassword = bcrypt.hashSync(Password, saltRounds);


    const query = "SELECT * FROM User WHERE Username = ?";
    const userData = [Username];

    dbConnection.query(query, userData, (error, result) => {
        if (error) {
            console.error('Error querying the database: ' + error.message);
            return res.status(500).json({ error: 'Error querying the database' });
        }

        if (result.length > 0) {
            // A matching user already exists
            return res.status(400).json({ error: 'User with the same username already exists' });
        }
        const insertedQuery = "INSERT INTO User (Username, Password, Email, Address, Phone) VALUES (?, ?, ?, ?, ?)";
        const insertedUserData = [Username, hashedPassword, Email, Address, Phone];

        dbConnection.query(insertedQuery, insertedUserData, (error, results) => {
            if (error) {
                console.error('Error inserting data: ' + error.message);
                res.status(500).send('Error inserting data into the database');
            } else {
                console.log('Data inserted into User table');
                console.log(results);
                const insertQuery = "INSERT INTO Merchant (Email, Address, Phone, BusinessName, BusinessDescription, BusinessLicenseNumber, User_ID) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const insertData = [Email, Address, Phone, BusinessName, BusinessDescription, BusinessLicenseNumber, results.insertId];
                dbConnection.query(insertQuery, insertData, (error, results) => {
                    if (error) {
                        console.error('Error inserting merchant: ' + error.message);
                        res.status(500).send('Error inserting merchant into the database');
                    } else {
                        res.status(200).send('Record added to the User table');
                    }
                });
            }
        });

    });
});

module.exports = router;
