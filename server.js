var express = require('express');
var dbConnection = require('./dbCon');
var app = express();

app.get('/healthcheck', function(req, res){
    res.status(200).json("API Service is running");
});

dbConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.listen(8083);