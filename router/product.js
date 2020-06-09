// api/product.js
var express = require('express');
var request = require('request');
var api = require('../config/common-api');
var async = require('async');
var router = express.Router();

// /product/ 
router.get(['/','/:page/:size'], (req, res) => {
   // api.newSession(req);

    var endpoint = api.endpoint() + '/product' + req.url; 
    if(req.url == '/')
        endpoint = endpoint + '1/10';
    console.log('[' + endpoint + ']');

    request(endpoint, (error, response, body) => {
        if(!error && response.statusCode == 200)
        {
            res.render('product', { cookie: 'api.session(req)', data: api.toJson(body)['data'].content });
            /*
            api.toJson(body)['data'].forEach(e => {
                console.log(e);
            });
            */
        }  
          
        res.end();

    });
});

// /product/:id
/*
router.get('/:id', (req, res) => {
    console.log(req.url);

    // get product information
    _request(api.endpoint() + '/product/' + req.url, api.session(req).id, 
        (body) => {
            console.log('--> ' + body + '\n');
            res.render('product-detail', 
                { cookie:api.session(req), data: api.toJson(body)['data'], history:null });
            res.end();
        },
        (response) => {
            console.log(response.statusCode);
            res.end();
        }
    );

    // get history
    _request(api.endpoint() + '/product/history' + req.url, api.session(req).id, 
        (body) => {
            console.log("......\n");
            console.log(api.toJson(body));
            console.log("......\n");
        },
        (response) => {console.log(response.statusCode)});

});
*/



router.get('/:id', (req, res) => {
 //   api.newSession(req);
    console.log(req.url);
    console.log(req.hostname + req.socket.localPort + req.baseUrl + req.url);

    async.waterfall(
        [
           function getHistory(next) {
                request(api.endpoint() + '/product/history' + req.url, 
                    { headers: {'sid': 'api.session(req).id' } },
                    (error, response, body) => {
                        next(error, body);
                    }
                );        
           },
           function getDetail(procutViewHistory, next) {
                console.log(procutViewHistory);

                request(api.endpoint() + '/product/' + req.url, 
                    { headers: {'sid': 'api.session(req).id' } },
                    (error, response, body) => {
                        next(error, procutViewHistory, body);
                    }
                );
           }     
        ], function render(err, procutViewHistory, productDetail) {
            if(err) 
                throw err;

            res.render('product-detail', 
                { cookie: 'api.session(req)', 
                    data: api.toJson(productDetail)['data'], 
                        history: api.toJson(procutViewHistory)['data'] });
        }
    );





    // get product information
    /*
    _request(api.endpoint() + '/product/' + req.url, api.session(req).id, 
        (body) => {
            console.log('--> ' + body + '\n');
            res.render('product-detail', 
                { cookie:api.session(req), data: api.toJson(body)['data'], history:null });
            res.end();
        },
        (response) => {
            console.log(response.statusCode);
            res.end();
        }
    );
    */

    // get history
    /*
    _request(api.endpoint() + '/product/history' + req.url, api.session(req).id, 
        (body) => {
            console.log("......\n");
            console.log(api.toJson(body));
            console.log("......\n");
        },
        (response) => {console.log(response.statusCode)});
    */

});



function _request(url, sid, onSuccess, onError) {

    request(url, { headers: {'sid': sid } }, (error, response, body) => {
        if(!error && response.statusCode == 200)
        {
            onSuccess(body);
        }    
        else {
            onError(response);
        }  
    });
}









module.exports = router;