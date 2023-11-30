const router = require("express").Router();
var dbConnection = require('./dbCon');

router.get('/', (req, res) => {
    const {customerId, merchantId} = req.query;
    let sql = `SELECT cr.ChatRoom_ID, cr.Chat_Completed, c.*, c.User_ID as Customer_UserID, m.*, m.User_ID as Merchant_UserID
               FROM ChatRoom cr
               INNER JOIN Customer c on cr.Customer_ID = c.Customer_ID 
               INNER JOIN Merchant m on cr.Merchant_ID = m.Merchant_ID
               WHERE cr.Chat_Completed = false`;
    if (customerId) {
        sql += ` AND cr.Customer_ID = '${customerId}'`;
    }
    if (merchantId) {
        sql += ` AND cr.Merchant_ID = ${merchantId}`;
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
    const chatRoomId = req.params.id;
    let sql = `SELECT * FROM ChatRoom WHERE ChatRoom_ID = ${chatRoomId}`;
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

router.post('/', (req, res) => {
    const { Customer_ID, Merchant_ID } = req.body;
    const chatData = req.body;
    console.log('Data to be inserted:', chatData); // Log to check the data being used for the insertion
    var query = `INSERT INTO ChatRoom (Customer_ID, Merchant_ID) 
                 VALUES (${Customer_ID}, ${Merchant_ID})`;
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

router.put('/:id', (req, res) => {
    const chatRoomId = req.params.id;
    var query = `UPDATE ChatRoom SET Chat_Completed = true where ChatRoom_ID = ${chatRoomId}`;
    dbConnection.query(query, (error, results) => {
        if (error) {
            console.error('Error updating data: ' + error.message);
            res.status(500).send('Error updating chat status into the database');
        } else {
            console.log('Data updated into ChatRoom table');
            res.status(200).send('Record updated to the ChatRoom table');
        }
    });
});

module.exports = router;