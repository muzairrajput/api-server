var express = require('express');
var app = express();

app.get('/healthcheck', function(req, res){
    res.status(200).json("API Service is running");
});

app.listen(8083);