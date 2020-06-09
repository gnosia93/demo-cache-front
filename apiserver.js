// apiserver.js
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use( (request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.header('Access-Control-Allow-Headers', 'content-type');
    next();
});

// API
app.use('/api/product', require('./api/product'));
app.use('/api/order', require('./api/order'));


var port = 3000;
app.listen(port, () => {
    console.log('listen on port: ' + port);
}); 


// test.
