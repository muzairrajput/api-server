const router = require("express").Router();
var dbConnection = require('./dbCon');

router.get('/', (req, res) => {
    console.log('GET request received at /order route'); // Log to verify that the route handler is reached
    const sql = "SELECT * FROM OrderTable";
    dbConnection.query(sql, (error, results) => {

        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from Order table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});


//order by specific order id
router.get('/:Order_ID', (req, res) => {
    console.log('GET request received at /order route'); // Log to verify that the route handler is reached

    // Extract the orderId parameter from the URL
    const orderId = req.params.Order_ID;

    // Query string using the orderId parameter
    const sql = "SELECT * FROM OrderTable WHERE Order_ID = ?";

    dbConnection.query(sql, [orderId], (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from Order table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});


// Post request for order
router.post('/', (req, res) => {
    console.log('POST request received at Create Order route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const { Customer_ID, OrderDate, TotalAmount } = req.body;
    const userData = req.body;
    console.log('Data to be inserted:', userData); // Log to check the data being used for the insertion
    var query = `Insert into OrderTable (Customer_ID, OrderDate, TotalAmount) 
    values (${Customer_ID},'${OrderDate}',${TotalAmount})`;

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

module.exports = router;