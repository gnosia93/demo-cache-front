const kafka = require('kafka-node');

try {
    console.log('kafka test..');

    const Producer = kafka.Producer;
    const client = new kafka.KafkaClient('localhost:2181');
    const producer = new Producer(client);

    producer.on('ready', async function() {
        console.log('ready');      
        let payloads = [
            {
                topic: 'test',
                messages: 'test test.111'
            }
        ];  

        producer.send(payloads, (err, data) => {
            if(err) console.log('failed..');
            else console.log('success');
        });
    });

    producer.on('error', (err) => {
        throw err;
    });

}
catch(e) {
    console.log(e);
}