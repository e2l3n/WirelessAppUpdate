var express = require('express');
var router = express.Router();
var WebSocket = require('ws');
var ws = null;
/*
	GET discovered clients.
*/

router.get('/discovered', function(req, res) {
	if (req.discovered_clients) {
		res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
		res.json(req.discovered_clients);	
	} else {
		res.statusCode = 404;
        res.send('Not found.');
	}   	
});

router.get('/connect', function(req, res) {
 	if (ws && ws.readyState === 1) {
		ws.terminate();
	}
	
 	ws = new WebSocket('ws://192.168.3.9:4567');
	ws.on('open', function() {
	                	 ws.send('something');
						 // console.log('did open');
	              		 res.statusCode = 200;
	                 	 res.setHeader('content-type', 'text/html');
	                 	 res.json([]);
	             	});
	ws.on('error', function(error) {
						//console.log('did receive error' + error);
            			res.statusCode = 409;
            			res.send('Did receive error.');
        			});
});

module.exports = router;
