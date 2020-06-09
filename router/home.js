var express = require('express');
var request = require('request');
var api = require('../config/common-api');
var router = express.Router();

var mysql = require('mysql');

router.get('/test', (req, res) => {
    res.render('about', {});
    
});

// home
router.get('/', (req, res) => {
    //api.newSession(req);

    //console.log("session id " + req.sessionID);
    //req.session.email = 'email';

    /*
    var mysqlRows = [];

    var myConnection = mysql.createConnection( {
        host: 'mbp-aurora-instance-1.cwhptybasok6.ap-northeast-2.rds.amazonaws.com',
        user: 'demo',
        password: 'demo',
        port: 3306,
        database: 'shop'
    });

    myConnection.connect();
    myConnection.query('select count(1) as cnt from product', (err, rows, fields) => {
        var result;
        if(!err) {
            result = rows[0].cnt;
        //    console.log(result);
        }   

    });
    
    myConnection.end();

    */
    


    /* backend health check */
    request(api.endpoint() + '/', (error, response, body) => {
        if(!error && response.statusCode == 200)
            res.render('home', { cookie: 'api.session(req)', data: body, aurora: 0 });
        else
            res.send(error); 
        res.end();
       // console.log(req.url);
       // console.log(api.prettyJson(body));
    });
});


module.exports = router;