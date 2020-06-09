var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
var dotenv = require('dotenv');

var session = require('express-session');
var DynamoDBStore = require('connect-dynamodb')(session); 
var AWS = require("aws-sdk");
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var api = require('./config/common-api');


setExecEnvironment();

console.log(path.join(__dirname, '/config/.env.prod'));
console.log("env ", process.env);

const LISTEN_PORT = 8080;
var app = express();
var server = app.listen(LISTEN_PORT, function() {
    console.log("express server listen on " + LISTEN_PORT);
});

/* static & ejs */
app.use('/static', express.static('public'))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Parse JSON bodies (as sent by API clients)

/* 라우팅 설정 */
// app.get('/');
app.use('/', require('./router/home'));
app.use('/product', require('./router/product'));
app.use('/order', require('./router/order'));





/* 소켓서버를 실행한다. */
var webSocketServer = require('ws').Server;
var wss = new webSocketServer({port:3000});

//console.log("web-socket server listen on 3000");
wss.on("connection", (socket) => {
    socket.send(getServerMessage("I am websocket server..."));
   
    socket.on("message", (orderInfo) => {
        
        var token = orderInfo.split(' ');
        var orderId = token[1];    // token 를 비동기 결제를 진행해야 하는 주문정보를 가지고 있다.   
                                   // 주문 웹서버, 웹소켓서버, 백엔드 결제서버, DB
        /*
         * 데이터베이스로 부터 결제 진행 상태를 조회한다. 
         * 한번만 조회하고..??
         * 결제의 타임 아웃 값은 ???
         * 비동기의 경우 생각해야 할 여러가지 CASE 가 많다. 
         * 클라이언트에게 실퍠를 통지한 후, 실제 back 단에서 결제가 성공하는 경우??
         * 결제 모듈이 명시적으로 오류를 보내기 전까지는 최초 주문화면에서는 무한으로 기다린다 ??
         * 결제 데몬에서 node.js wS 서버 쪽으로 Notification 이 필요함..
         */
        socket.send(getServerMessage("request delivered..." + orderInfo));

        let isWorking = false;
        setInterval(() => {
            if (isWorking) 
                return;
        
            isWorking = true;
            checkPaymentStatus( orderId, 
                () => { 
                        isWorking = false;         
                        socket.send(getServerMessage("waiting pay completion..."));
                      },               // onFail
                () => {                                     // onSuceess 
                    socket.send(getServerMessage(orderId + 'payok')); 
                    clearInterval(this); 
                }     
            );
        }, 1000);
    })
});


function setExecEnvironment() {
    if( process.env.NODE_ENV == 'dev')
        dotenv.config({ path: path.join(__dirname, '/config/.env.dev')});
    else if( process.env.NODE_ENV == 'prod')
        dotenv.config({ path: path.join(__dirname, '/config/.env.prod')});
    else {
        //dotenv.config({ path: path.join(__dirname, '/config/.env.prod')});
        throw new Error('process.env.NODE_ENV is missing!');
    }
}



function getServerMessage(str) {
    return "[SVR] " + str;
}


function checkPaymentStatus(orderId, onFail, onSuccess) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'demo',
        password : 'demo',
        database : 'shop'    
    });

    connection.connect();
    connection.query(
        "SELECT count(1) as cnt FROM `order` WHERE pay_status = 'Completed' and order_id = " + orderId, 
        function(err, rows, fields) {
            if (!err && rows[0].cnt == 1)
                onSuccess();
            else
                onFail();
        }
    );
    connection.end();
}

