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
        res.send(generateResponse(req.discovered_clients, ''));
    } else {
        res.statusCode = 404;
        res.send(generateResponse(null, 'Not found.'));
    }
});

router.get('/connect/ip/:ip/port/:port', function(req, res) {
    var ip = req.params.ip;
    var port = req.params.port;

    if (typeof ip !== 'string' || typeof port !== 'string') {
        res.statusCode = 400;
        res.send(generateResponse(null, 'Invalid or missing parameters.'));

        return;
    }

    if (ws && ws.readyState === 1) {
        /*
		 Immediately terminate the socket connection without informing the
		 other lister (mobile app) by sending 'close' event. 
		 The current bussuness logic doesn't impose any actions 
		 on the client side when the node.js app disconnects. 
		*/
        ws.terminate();
    }

    ws = new WebSocket('ws://' + ip + ':' + port);
    ws.on('open', function() {
        ws.send('something');
        // console.log('did open');
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        res.send(generateResponse(null, ''));
    });
    ws.on('error', function(error) {
        //console.log('did receive error' + error);
        res.statusCode = 409;
        res.send(generateResponse(null, 'Did receive error.'));
    });
});

// Utility methods

function generateResponse(result, errorMsg) {
    return {
         error: (typeof errorMsg === 'string') ? errorMsg : '',
        result: result
    };
}

module.exports = router;
