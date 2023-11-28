const router = require("express").Router();
var dbConnection = require('./dbCon');

router.get('/:id', (req, res) => {
    console.log('GET request received at /retrieve route'); // Log to verify that the route handler is reached
    const customerId = req.params.id;

    dbConnection.query(`select * from ShoppingCart where CustomerID = ${customerId}`, (error, results) => {

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
    const {CustomerID, ProductID, Quantity, UnitPrice} = req.body;
    const cartData = req.body;
    console.log('Data to be inserted:', cartData); // Log to check the data being used for the insertion

    var query = `INSERT INTO ShoppingCart(CustomerID, ProductID, Quantity, UnitPrice) 
    VALUES (${CustomerID},'${ProductID}','${Quantity}','${UnitPrice}')`;

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

router.delete('/:id', (req, res) => {
    console.log('DELETE request received at /delete route'); // Log to verify that the route handler is reached
    const customerId = req.params.id;

    dbConnection.query(`DELETE FROM ShoppingCart WHERE CustomerID = ${customerId}`, (error, results) => {
        if (error) {
            console.error('Error deleting data: ' + error.message);
            res.status(500).send('Error deleting data from the database');
        } else if (results.affectedRows === 0) {
            console.log('No data found for deletion');
            res.status(404).send('No data found for deletion');
        } else {
            console.log('Data deleted from ShoppingCart table');
            res.status(200).send('Record deleted from the ShoppingCart table');
        }
    });
});


module.exports = router;