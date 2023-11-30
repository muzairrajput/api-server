const router = require("express").Router();
var dbConnection = require('./dbCon');


//get orderitems by order id
router.get('/:Order_ID', (req, res) => {
    console.log('GET request received at /order route'); // Log to verify that the route handler is reached

    // Extract the orderId parameter from the URL
    const orderId = req.params.Order_ID;

    // Query string using the orderId parameter
    const sql = "SELECT * FROM OrderItems WHERE OrderId = ?";

    dbConnection.query(sql, [orderId], (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from OrderItems table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});


//post request to create order item
router.post('/', (req, res) => {
    console.log('POST request received at Create Order route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const { OrderId, ProductId, UnitPrice,Quantity } = req.body;
    const userData = req.body;
    console.log('Data to be inserted:', userData); // Log to check the data being used for the insertion
    var query = `Insert into OrderItems (OrderId, ProductId, UnitPrice,Quantity) 
    values (${OrderId},${ProductId},${UnitPrice}, ${Quantity})`;

    dbConnection.query(query, userData, (error, results) => {
        if (error) {
            console.error('Error inserting data: ' + error.message);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into OrderItems');
            res.status(200).send('Record added to the OrderItems');
        }
    });
});

// delete by orderitem id
router.delete('/:id', (req, res) => {
    console.log('DELETE request received at /delete route'); // Log to verify that the route handler is reached
    const OrderId = req.params.id;

    dbConnection.query(`DELETE FROM OrderItems WHERE OrderId = ${OrderId}`, (error, results) => {
        if (error) {
            console.error('Error deleting data: ' + error.message);
            res.status(500).send('Error deleting data from the database');
        } else if (results.affectedRows === 0) {
            console.log('No data found for deletion');
            res.status(404).send('No data found for deletion');
        } else {
            console.log('Data deleted from OrderItems table');
            res.status(200).send('Record deleted from the OrderItems table');
        }
    });
});

module.exports = router;