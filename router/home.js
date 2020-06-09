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