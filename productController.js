const router = require("express").Router();
var dbConnection = require('./dbCon');

router.get('/', (req, res) => {
    // Use a SELECT query to retrieve data from the User table
    let {category, vendorId, sortBy, order} = req.query;
    if (!sortBy) {
        sortBy = 'name';
    }
    if (!order) {
        order = 'ASC';
    }
    console.log(category);
    let sql = "SELECT * FROM Product WHERE 1=1";
    if (category) {
        sql += ` AND Category = '${category}'`;
    }
    if (vendorId) {
        sql += ` AND Vendor_ID = ${vendorId}`;
    }
    sql += ` ORDER BY ${sortBy} ${order}`;
    console.log('SQL: '+sql);
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from Product table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

//retrieving all messages by chatroom id
router.get('/:id', (req, res) => {
    console.log('GET request received at /order route'); // Log to verify that the route handler is reached

    // Extract the orderId parameter from the URL
    const Product_ID = req.params.id;

    // Query string using the orderId parameter
    const sql = "SELECT * FROM Product WHERE Product_ID = ?";

    dbConnection.query(sql, [Product_ID], (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from Product table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

router.post('/', (req, res) => {
    console.log('POST request received at create Product route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const {name, description, category, price, stock, vendorId} = req.body;
    const msgData = req.body;
    console.log('Data to be inserted:', msgData); // Log to check the data being used for the insertion
    var query = `INSERT INTO Product (Name, Description, Category, Price, StockQuantity, Vendor_ID)
    values ('${name}', '${description}','${category}', ${price}, ${stock}, ${vendorId})`;
    console.log(query);
    dbConnection.query(query, msgData, (error, results) => {
        if (error) {
            console.error('Error inserting data: ' + error.message);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into Product table');
            res.status(200).send('Record added to the Product table');
        }
    });
});

router.put('/:productId', (req, res) => {
    console.log('POST request received at create Product route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const productId = req.params.productId;
    const {name, description, category, price, stock} = req.body;
    const msgData = req.body;
    console.log('Data to be updated:', msgData); // Log to check the data being used for the insertion
    var query = `UPDATE Product SET Name = '${name}', Description = '${description}', Category = '${category}', Price = ${price}, StockQuantity = ${stock} WHERE Product_ID = ${productId}`;
    console.log(query);
    dbConnection.query(query, msgData, (error, results) => {
        if (error) {
            console.error('Error updating data: ' + error.message);
            res.status(500).send('Error updating data into the database');
        } else {
            console.log('Data updating into Product table');
            res.status(200).send('Record updating to the Product table');
        }
    });
});

module.exports = router;