const router = require("express").Router();
var dbConnection = require('./dbCon');

router.get('/', (req, res) => {
    // Use a SELECT query to retrieve data from the User table
    dbConnection.query('SELECT * FROM Message', (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from Message table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

//retrieving all messages by chatroom id
router.get('/:ChatRoom_ID', (req, res) => {
    console.log('GET request received at /order route'); // Log to verify that the route handler is reached

    // Extract the orderId parameter from the URL
    const ChatRoom_ID = req.params.ChatRoom_ID;

    // Query string using the orderId parameter
    const sql = "SELECT * FROM Message WHERE ChatRoom_ID = ?";

    dbConnection.query(sql, [ChatRoom_ID], (error, results) => {
        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from Order table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});



router.post('/', (req, res) => {
    console.log('POST request received at create Message route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const {chatroomId, senderId, content, timesent} = req.body;
    const msgData = req.body;
    console.log('Data to be inserted:', msgData); // Log to check the data being used for the insertion
    var query = `Insert into Message (ChatRoom_ID, Sender_ID, Content, TimeSent) 
    values (${chatroomId}, ${senderId},'${content}', ${timesent})`;
    dbConnection.query(query, msgData, (error, results) => {
        if (error) {
            console.error('Error inserting data: ' + error.message);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into Message table');
            res.status(200).send('Record added to the Message table');
        }
    });
});

module.exports = router;