<?php


use Bunny\Client;

require 'vendor/autoload.php';

$client = (new Client())->connect();
$channel = $client->channel();

$channel->queueDeclare('service1', false, false, false, false);


	for(;;)
	{
		$date = time();
		$channel->publish(date('H:i:s -',$date).' Servis 1', [], '', 'service1');
		$channel->publish(date('H:i:s -',$date).' Servis 2', [], '', 'service2');
		echo date('H:i:s d.M.Y',$date)."\n";
		sleep(5);
	}

$channel->close();
$client->disconnect();


