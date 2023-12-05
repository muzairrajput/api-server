var express = require('express');
const fs = require('fs');
//const fileUpload = require('express-fileupload');
var cloudinary = require('cloudinary');
var axios = require('axios');
//const multer = require('multer');
var dbConnection = require('./dbCon');
var cors = require('cors');
var routes = require('./routes');
var app = express();
//app.use(fileUpload());

//var AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
app.use(cors({origin: '*'}));
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

cloudinary.config({ 
  cloud_name: 'df8kw4ytc', 
  api_key: '696197316165375', 
  api_secret: 'L9PB_webZIOKYVcnYFtP2ozJsuM' 
});

app.use('/' , routes);

app.get('/healthcheck', function (req, res) {
    res.status(200).json("API Service is running");
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
                console.log(results);
                const insertQuery = "INSERT INTO Customer (User_ID, Email, Address, Phone) VALUES (?, ?, ?, ?)";
                const insertData = [results.insertId, Email, Address, Phone];
                dbConnection.query(insertQuery, insertData, (error, results) => {
                    if (error) {
                        console.error('Error inserting customer: ' + error.message);
                        res.status(500).send('Error inserting customer into the database');
                    } else {
                        res.status(200).send('Record added to the User table');
                    }
                });
            }
        });
       
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

const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Specify the destination folder for storing the files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the saved file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});


const upload = multer({ storage });

// POST API endpoint for uploading files
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path.replace('public', ''); // Get the relative path of the saved file

  return res.json({ filePath }); // Return the path of the saved file
});

app.post('/imageUpload', upload.single('file'), async (req, res) => {
    // AWS.config.update({
    //     accessKeyId: "AKIASOEIBGCNE2VIL2BC", // Access key ID
    //     secretAccesskey: "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", // Secret access key
    //     region: "us-east-2" //Region
    // })
    // const s3 = new AWS.S3();
    // const fileContent  = Buffer.from(req.files.uploadedFileName.data, 'binary');
    // const params = {
    //     Bucket: 'bazaar-ui',
    //     Key: "test.jpg", // File name you want to save as in S3
    //     Body: fileContent 
    // };

    // // Uploading files to the bucket
    // s3.upload(params, function(err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     res.send({
    //         "response_code": 200,
    //         "response_message": "Success",
    //         "response_data": data
    //     });
    // });
    // cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    // { public_id: "olympic_flag" }, 
    // function(error, result) {
    //     console.log(result); 
    // });
    // const imageBuffer = fs.readFileSync(req.file);
    // // Convert the image to Base64
    // const base64Image = imageBuffer.toString('base64');

    // const currentTimeEpoch = Math.floor(new Date().getTime() / 1000);
    // var params_to_sign = {timestamp:currentTimeEpoch}
    // var signature = await cloudinary.utils.api_sign_request(params_to_sign, 'L9PB_webZIOKYVcnYFtP2ozJsuM');
    // const file = req.file;
    // //const fileContent  = Buffer.from(req.files.uploadedFileName.data, 'binary');
    // const config = {
    //     headers: { "X-Requested-With": "XMLHttpRequest" },
    //   };
    // try {
    //     var fd = new FormData();
    //     fd.append("timestamp", currentTimeEpoch);
    //     fd.append("file", base64Image);
    //     fd.append("api_key", 696197316165375);
    //     fd.append("signature", signature);
    //     console.log(fd);
    //     const response = await axios.post('https://api.cloudinary.com/v1_1/df8kw4ytc/image/upload', fd, config);
    //     console.log(response);
    // } catch (error) {
    //     console.error(error);
    // }
});

app.listen(8083);