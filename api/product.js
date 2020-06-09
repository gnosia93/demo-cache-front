// api/product.js
var express = require('express');
var productRouter = express.Router();

function debug(request) {
    console.log(request.method + " " + request.url);
}

// Index
productRouter.get('/', (request, response, next) => {
   // request.met
    debug(request);
    response.json({success:true, data:'list'});
});

// Show
productRouter.get('/:id', (request, response, next) => {
    // request.met
    debug(request);
    response.json({success:true, data:'product'});
});




module.exports = productRouter;