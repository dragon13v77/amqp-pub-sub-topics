var amqp = require('amqplib/callback_api');

const LOCAL_URL = 'amqp://localhost';
const EXCHANGE_NAME = 'topic_logs';

var args = process.argv.slice(2);
// routing keys of logs will have two words: "<facility>.<severity>".

amqp.connect(LOCAL_URL, function (error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}

		channel.assertExchange(EXCHANGE_NAME, 'topic', {
			durable: false
		});

		channel.assertQueue('', {
			exclusive: true
		}, function (error2, q) {
			if (error2) {
				throw error2;
			}

			console.log(' [*] Waiting for logs. To exit press CTRL+C');

			args.forEach(function(key) {
				channel.bindQueue(q.queue, EXCHANGE_NAME, key);
			});

			channel.consume(q.queue, function (msg) {
				if (msg.content) {
					console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
				}
			}, {
				noAck: true
			});
		});
	});
});