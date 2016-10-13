var config = require('./conf');
var express = require('express')
var ws = require("nodejs-websocket")
var amqp = require('amqplib/callback_api');
var app = express();

/**
*	Just return OK for status check 
**/
app.get('/status', function (req, res) {
	res.send('OK');
});

/**
*	Return the landing page
**/
app.get('/',function(req, res){//get,put,post,delete   
      res.sendFile(__dirname + '/public/index.html');
    });


/**
*	Subscriptions dictionary (key:service name, value: list of connected clients)
**/
var subscriptions = {};
config.services.forEach(function(service){
	subscriptions[service] = [];
});
 
//	Initiate websocket server
var server = ws.createServer(function (conn) {

	conn.on("text", function (str) {
		// handle service subscription
		var object = JSON.parse(str);
		if (object.subscribe==true){
			subscribeService(conn,object.serviceName);
		}else{
			unsubscribeService(conn,object.serviceName);
		}
	})
	conn.on("close", function (code, reason) {
		unsubscribeAll(conn);
	});
	conn.on("error", function(err) {/* do nothing */});
    
}).listen(config.socketServerPort);

/**
*	Handle service subscription
*/
function subscribeService(conn,serviceName){
	var service = subscriptions[serviceName];
	// vea add
	if (service!=null && service.indexOf(conn) < 0){
		service.push(conn);
	}
}

/**
*	Handle service unsubscription
*/
function unsubscribeService(conn,service){
	var array = subscriptions[service];
	if (array!=null){
		var index = array.indexOf(conn);
		if (index>-1){
			console.log('unsubscribed' + index);
			subscriptions[service].splice(index, 1);
		}
	}
}

/**
*	Handle all services unsubscription
*/
function unsubscribeAll(conn){
	for (var service in subscriptions){
		var index = subscriptions[service].indexOf(conn);
		if (index>-1)
			subscriptions[service].splice(index, 1);
	}
}

// initiate connection to rabbitMQ service
amqp.connect(config.rabbitmq_server, function(err, conn) {
	conn.createChannel(function(err, ch) {
		if (err){
			console.log("error connecting to rabbitMQ");
			process.exit(1);
		}

		config.services.forEach(function(service){
			ch.assertQueue(service, {durable: false});
			var sname = service;
		    	ch.consume(sname, function(msg) {
		    		//send message to all subscribed clients
				var name = sname;
				var message = msg.content.toString();
				var service = subscriptions[name];
				if (service!=null){
			        		for (var i = 0, len = service.length; i < len; i++) {
				  		service[i].sendText(JSON.stringify({name:name,message:message}));
					}
			  	}
			}, {noAck: true});
		});
 	});
});

// Start the application server
app.listen(config.serverPort);
console.log("Started listening on port "+config.serverPort);