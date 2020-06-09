// api/order.js
var express = require('express');
var request = require('request');
var api = require('../config/common-api');
var router = express.Router();

// /order/ 

router.get(['/', '/:page/:size'], (req, res) => {
    //api.newSession(req);

    var endpoint = api.endpoint() + '/order' + req.url; 
    if(req.url == '/')
        endpoint = endpoint + '1/10';
    console.log('[' + endpoint + ']');

    request(endpoint, (error, response, body) => {
        if(!error && response.statusCode == 200)
        {
            res.render('order', { cookie: 'api.session(req)', data: api.toJson(body).data.content });
        }

        res.end();
     
    });
});


// /order/:id
router.get('/:id([0-9]+)', (req, res, next) => {
    //api.newSession(req);

    request(api.endpoint() + '/order' + req.url, (error, response, body) => {
        if(!error && response.statusCode == 200)
        {
         //   res.render('order-detail', { data: api.toJson(body).data });

            var data = api.toJson(body).data
            data.payStatus = 'completed'
            res.render('order-detail', { cookie: 'api.session(req)', ws_server_url: process.env.WS_SERVER_URL, data: data });

        }    

        res.end();
        console.log(req.url);
        console.log(api.prettyJson(body));
    });   
});


// /order/add
/*
router.post('/add', (req, res) => {
    
    request.post(api.endpoint + '/order/add', {
        json: {
                "orderId": 0,
                "productId": req.body.productId,
                "orderPrice": 0,
                "payStatus": null,
                "orderDate": null,
                "payDate": null,
                "errorDate": null,
                "errorMessage": null
              }    
        }, (error, response, body) => {
            if(!error && response.statusCode == 200)
            {
                res.render('order-detail', { ws_server_url: process.env.WS_SERVER_URL, data: body.data });
            }    
    
            res.end();
            console.log(req.url);
            console.log(api.endpoint + '/order/add');
          //  console.log(api.prettyJson(body));
        }
    );   

});


// /order/event-add
router.post('/event-add', (req, res) => {
    
    request.post(api.endpoint + '/order/event-add', {
        json: {
                "orderId": 0,
                "productId": req.body.productId,
                "orderPrice": 0,
                "payStatus": null,
                "orderDate": null,
                "payDate": null,
                "errorDate": null,
                "errorMessage": null
              }    
        }, (error, response, body) => {
            if(!error && response.statusCode == 200)
            {
                res.render('order-detail', { ws_server_url: process.env.WS_SERVER_URL, data: body.data });
            }    
    
            res.end();
            console.log(req.url);
            console.log(api.endpoint + '/order/event-add');
          //  console.log(api.prettyJson(body));
        }
    );   

});
*/


router.post('/add', (req, res) => {
    //api.newSession(req);

    order('/order/add', req, res);
})

router.post('/event-add', (req, res) => {
    api.newSession(req);

    order('/order/event-add', req, res);
})



function order(uri, req, res) {
    request.post(api.endpoint() + uri, {
        json: {
                "orderId": 0,
                "productId": req.body.productId,
                "orderPrice": 0,
                "payStatus": null,
                "orderDate": null,
                "payDate": null,
                "errorDate": null,
                "errorMessage": null
              }    
        }, (error, response, body) => {
            if(!error && response.statusCode == 200)
            {
                // 비동기 처리 로직을 제외시키기 위해 강제로 업데이트.
                body.data.payStatus = 'completed';
                res.render('order-detail', { cookie: 'api.session(req)', ws_server_url: process.env.WS_SERVER_URL, data: body.data });
            }    
    
            res.end();
        }
    );   
}



module.exports = router;