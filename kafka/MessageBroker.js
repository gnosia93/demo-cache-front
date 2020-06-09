const kafka = require('kafka-node');
// const bodyParser = require('body-parser');
const config = require('../config/kafka');

class MessageBroker {

    constructor() {
        const Producer = kafka.Producer;
        const client = new kafka.KafkaClient('localhost:2181');
        this.producer = new Producer(client);
        this.counter = 0;

        console.log('broker is constructed..');
    }

    post(message) {
        try {
            this.counter++;
            console.log('post is called. ' + this.counter);
            const gProducer = this.producer;

            gProducer.on('ready', async function() {
                console.log('ready');      
                let payloads = [
                    {
                        topic: 'test',
                        messages: message
                    }
                ];  

                gProducer.send(payloads, (err, data) => {
            //   this.producer.send(payloads, (err, data) => {
                    if(err) console.log('failed..');
                    else console.log('success .. ' + message);
                });
            });
    
        } catch(e) {
            console.log(e);
        }
    }
}

/* 싱글톤으로 설정하면, ready 상태가 되지 않는다 왜 일까? */
//module.exports = new MessageBroker;

module.exports = MessageBroker;
