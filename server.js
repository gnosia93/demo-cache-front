var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


var server = app.listen(3000, function() {
    console.log("hello express web server. 3000");
});

var router = require('./router/main')(app);


