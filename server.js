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
    console.log('POST request received at /signup route'); // Log to verify that the route handler is reached
    const Username = req.body.Username;
    const Password = req.body.Password;
    const Email = req.body.Email;
    const Address = req.body.Address;
    const Phone = req.body.Phone;
    // Use the data from the request body
    

    if (!Username || !Password || !Email || !Address || !Phone) {
        return res.status(400).json({ error: 'All fields must be filled for successful signup.' });
    }
    
    //const hashedPassword = hashAndSalt(Password);

    

    const query = "SELECT * FROM User WHERE Username = ? AND Password = ?"
    const userData = [Username, Password];

    dbConnection.query(query,userData,(error,result) => {
        if (error) {
            console.error('Error querying the database: ' + error.message);
            return res.status(500).json({ error: 'Error querying the database' });
        }

        if (result.length > 0) {
            // A matching user already exists
            return res.status(400).json({ error: 'User with the same username and password already exists' });
        }

        //inserting user data

        const insertedQuery = "Insert into User (Username, Password, Email, Address, Phone) values (?,?,?,?,?)";
        const insertedUserData = [Username, Password, Email, Address, Phone];
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


// Post request for order
app.post('/order', (req, res) => {
    console.log('POST request received at Create Order route'); // Log to verify that the route handler is reached
    // Use the data from the request body
    const {Customer_ID, OrderDate, TotalAmount} = req.body;
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

app.post('/login', (req, res) => 
{
    const Username =req.body.Username;
    const Password = req.body.Password;
     
    console.log('Data to be logged in:', Username, Password);
   
    var query = "SELECT * FROM User WHERE Username = ? AND  Password = ?";
    //const hashedPassword = hashAndSalt(Password)
    dbConnection.query(query, [Username, Password], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in running query"});
        if(result.length > 0) {
            return res.json({Status: "Success"})
        } else {
           
               //console.log(db.query);
               return res.json({Status: "Error", Error: "Wrong Username or Password"});
            
        }
    })
})




app.listen(8083);