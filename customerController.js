const router = require("express").Router();
var dbConnection = require('./dbCon');

router.get('/', (req, res) => {
    console.log('GET request received at /retrieve route'); // Log to verify that the route handler is reached
    const {email, userId} = req.query;
    let sql = "SELECT * FROM Customer WHERE 1=1";
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
            console.log('Data retrieved from User table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

router.get('/:id', (req, res) => {
    console.log('GET request received at /retrieve route'); // Log to verify that the route handler is reached
    const customerId = req.params.id;

    dbConnection.query(`select * from Customer c where c.Customer_ID = ${customerId}`, (error, results) => {

        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from User table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

router.post('/', (req, res) => {
    console.log('POST request received at Create customer route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const {User_ID, Email, Address, Phone, Name} = req.body;
    const chatData = req.body;
    console.log('Data to be inserted:', chatData); // Log to check the data being used for the insertion

    var query = `INSERT INTO Customer(User_ID,Email,Address,Phone, Name) 
    VALUES (${User_ID},'${Email}','${Address}','${Phone}', '${Name}')`;

    dbConnection.query(query, (error, results) => {
        if (error) {
            console.error('Error inserting data: ' + error.message);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into ChatRoom table');
            res.status(200).send('Record added to the ChatRoom table');
        }
    });
});

module.exports = router;