var amqp = require('amqplib/callback_api');

const LOCAL_URL = 'amqp://localhost';
const EXCHANGE_NAME = 'topic_logs';

var args = process.argv.slice(2);
var key = (args.length > 0) ? args[0] : 'anonymous.info';
var msg = args.slice(1).join(' ') || 'Hello World!';
// routing keys of logs will have two words: "<facility>.<severity>".

amqp.connect(LOCAL_URL, function(error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function(error1, channel) {
		if (error1) {
			throw error1;
		}

		channel.assertExchange(EXCHANGE_NAME, 'topic', {
			durable: false
		});
		channel.publish(EXCHANGE_NAME, key, Buffer.from(msg));
		console.log(" [x] Sent %s: '%s'", key, msg);
	});

	setTimeout(function() {
		connection.close();
		process.exit(0);
	}, 500);
});