// api/order.js
var express = require('express');
var orderRouter = express.Router();

orderRouter.post('/', (request, response, next) => {
    var data = request.body;

    console.log(JSON.stringify(request.headers, null, 4));
    console.log(data);
    // 데이터베이스에 저장
  
    response.json({success:true, data:data});
});



module.exports = orderRouter;