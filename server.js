var express = require('express');
var dbConnection = require('./dbCon');
var app = express();
const bcrypt = require('bcrypt');
app.use(express.json());

app.get('/healthcheck', function (req, res) {
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
            console.log('Data retrieved from Merchant table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

// Define a route to handle POST requests for data insertion
app.post('/merchant', (req, res) => {
    console.log('POST request received at Create merchant route'); // Log to verify that the route handler is reached
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



app.get('/user', (req, res) => {
    console.log('GET request received at /user route'); // Log to verify that the route handler is reached

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
app.post('/signup', (req, res) => {
    console.log('POST request received at /signup route');

    const {Username, Password, Email, Address, Phone} = req.body;

    if (!Username || !Password || !Email || !Address || !Phone) {
        return res.status(400).json({ error: 'All fields must be filled for successful signup.' });
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
                res.status(200).send('Record added to the User table');
            }
        });
    });
});




//get request for order table

app.get('/order', (req, res) => {
    console.log('GET request received at /order route'); // Log to verify that the route handler is reached

    //query string:

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
app.get('/order/:Order_ID', (req, res) => {
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
app.post('/order', (req, res) => {
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



app.post('/login', (req, res) => {
    const Username = req.body.Username;
    const Password = req.body.Password;

    console.log('Data to be logged in:', Username, Password);

    const query = "SELECT * FROM User WHERE Username = ?";
    dbConnection.query(query, [Username], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in running query" });

        if (result.length > 0) {
            // User with the given username exists
            const hashedPassword = result[0].Password;

            // Compare the provided plaintext password with the hashed password
            bcrypt.compare(Password, hashedPassword, (compareErr, isMatch) => {
                if (compareErr) {
                    return res.json({ Status: "Error", Error: "Error comparing passwords" });
                }

                if (isMatch) {
                    // Passwords match, login successful
                    return res.json({ Status: "Success" });
                } else {
                    // Passwords do not match
                    return res.json({ Status: "Error", Error: "Wrong Username or Password" });
                }
            });
        } else {
            // User with the given username does not exist
            return res.json({ Status: "Error", Error: "Wrong Username or Password" });
        }
    });
});



app.get('/ChatRoom', (req, res) => {
    console.log('GET request received at /retrieve route'); // Log to verify that the route handler is reached


    dbConnection.query('SELECT * FROM ChatRoom', (error, results) => {

        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from User table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

app.post('/ChatRoom', (req, res) => {
    console.log('POST request received at Create chatroom route'); // Log to verify that the route handler is reached
    // Use the data from the request body
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

app.get('/Customer', (req, res) => {
    console.log('GET request received at /retrieve route'); // Log to verify that the route handler is reached


    dbConnection.query('SELECT * FROM Customer', (error, results) => {

        if (error) {
            console.error('Error retrieving data: ' + error.message);
            res.status(500).send('Error retrieving data from the database');
        } else {
            console.log('Data retrieved from User table');
            res.status(200).json(results); // Send the retrieved data as a JSON response
        }
    });
});

app.post('/Customer', (req, res) => {
    console.log('POST request received at Create customer route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const { Customer_ID, User_ID, Email, Address, Phone } = req.body;
    const chatData = req.body;
    console.log('Data to be inserted:', chatData); // Log to check the data being used for the insertion

    var query = `INSERT INTO Customer(User_ID,Email,Address,Phone ) 
    VALUES (${User_ID},'${Email}','${Address}','${Phone}')`;

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

app.get('/message', (req, res) => {
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
app.get('/message/:ChatRoom_ID', (req, res) => {
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



app.post('/message', (req, res) => {
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


app.listen(8083);