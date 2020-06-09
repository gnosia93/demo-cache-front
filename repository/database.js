var mysql = require('mysql');
var dbconfig = require('../config/mysql');
var connection = mysql.createConnection(dbconfig.local);

