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
        // console.log('did open');
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        res.send(generateResponse(null, ''));
    });
    ws.on('error', function(error) {
        // console.log('did receive error' + error);
        res.statusCode = 409;
        res.send(generateResponse(null, 'Did receive error.'));
    });
});

router.post('/update', function(req, res) {
    var html = req.body.html;
    if (typeof html !== 'string') {
        //console.log('400 ');
        res.statusCode = 400;
        res.send(generateResponse(null, 'Invalid or missing parameters.'));

        return;
    }

    if (!ws || ws.readyState !== 1) {
        res.statusCode = 500;
        res.send(generateResponse(null, 'No socket connection available.'));

        return;
    }

    ws.send(generateCommand(req.constants.kCommandUpdate, html));
    ws.on('message', function(error) {
        //console.log('Error is ' + error);
        res.statusCode = error != null ? 500 : 200;
        res.send(generateResponse(null, error == null ? error : 'Failed send html.'));
    });
});

router.get('/refresh', function(req, res) {
    if (!ws || ws.readyState !== 1) {
        res.statusCode = 500;
        res.send(generateResponse(null, 'No socket connection available.'));

        return;
    }

    ws.send(generateCommand(req.constants.kCommandRefresh, null));
    ws.on('message', function(error) {
        res.statusCode = error != null ? 500 : 200;
        res.send(generateResponse(null, error == null ? error : 'Failed to send html.'));
    });
});

// Utility methods

function generateResponse(result, errorMsg) {
    return {
        'error': (typeof errorMsg === 'string') ? errorMsg : '',
        'result': result
    };
}

function generateCommand(command, payload) {
    return 'command:' + ((typeof command === 'string') ? command : '') + ';payload:' + payload;
}

module.exports = router;