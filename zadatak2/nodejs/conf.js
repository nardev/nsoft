var config = {};
// web application server port
config.serverPort = 3000;
//websocket server port
config.socketServerPort = 8000;
// list of backend service queues. NOTE: needs to be updated in frontend too.
config.services = ["service1","service2"];

config.rabbitmq_server = 'amqp://localhost:5672';

module.exports = config;