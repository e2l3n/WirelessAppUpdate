var express = require('express');
var router = express.Router();
var WebSocket = require('ws');
var wsList = [];

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

router.get('/isconnected/ip/:ip/port/:port', function(req, res) {
    var ip = req.params.ip;
    var port = req.params.port;
    var ws = findObjectInArray(wsList, function(socket) {
        return socket.ip.localeCompare(ip) == 0 && socket.port.localeCompare(port) == 0;
    });
	
    if (ws && ws.socket.readyState === 1) {
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
	
    var ws = findObjectInArray(wsList, function(socket) {
        return socket.ip.localeCompare(ip) == 0 && socket.port.localeCompare(port) == 0;
    });
    if (ws && ws.socket.readyState === 1) {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        res.send(generateResponse(null, ''));
        return;
    } else {
        if (ws && ws.socket) {
            ws.socket.terminate();
            //throw away the socket.
            wsList = wsList.filter(function(aSocket) {
                return aSocket.ip.localeCompare(ws.ip) !== 0 && aSocket.port.localeCompare(ws.port) !== 0;
            });
        }

        ws = generateWSObject(ip, port);
        wsList.push(ws);
        ws.socket.on('open', function() {
            res.statusCode = 200;
            res.setHeader('content-type', 'text/html');
            res.send(generateResponse(null, ''));
        });
        ws.socket.on('error', function(error) {
            res.statusCode = 409;
            res.send(generateResponse(null, 'Did receive error.'));
        });
    }
});

router.get('/disconnect/ip/:ip/port/:port', function(req, res) {
    var ip = req.params.ip;
    var port = req.params.port;
    if (typeof ip !== 'string' || typeof port !== 'string') {
        res.statusCode = 400;
        res.send(generateResponse(null, 'Invalid or missing parameters.'));

        return;
    }

	var foundIndex = - 1;			
	for (i = 0; i < wsList.length; i ++) {
		if (wsList[i].ip.localeCompare(ip) == 0 && wsList[i].port.localeCompare(port) == 0) {
			// console.log('FOUND');
			foundIndex = i;
			break;
		} 
	}

	if (foundIndex != -1) {
		var wsToTerminate = wsList[foundIndex];
		wsToTerminate.socket.terminate();
		wsList.splice(foundIndex, 1);
		
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        res.send(generateResponse(null, ''));
	} else {
        res.statusCode = 409;
        res.send(generateResponse(null, 'Failed to disconnect.'));
	}
});

router.post('/update/ip/:ip/port/:port', function(req, res) {
    var ip = req.params.ip;
    var port = req.params.port;
    var html = req.body.html;

    if (typeof html !== 'string' || typeof ip !== 'string' || typeof port !== 'string') {
        //console.log('400 ');
        res.statusCode = 400;
        res.send(generateResponse(null, 'Invalid or missing parameters.'));

        return;
    }

    var ws = findObjectInArray(wsList, function(socket) {
        return socket.ip.localeCompare(ip) == 0 && socket.port.localeCompare(port) == 0;
    });
	
    if (!ws || ws.socket.readyState != 1) {
        res.statusCode = 500;
        res.send(generateResponse(null, 'No socket connection available.'));

        return;
    }

    ws.socket.send(generateCommand(req.constants.kCommandUpdate, html));
    //TODO: Check if event listener is being overriden.
    ws.socket.on('message', function(error) {
        //console.log('Error is ' + error);
        res.statusCode = error != null ? 500 : 200;
        res.send(generateResponse(null, error == null ? error : 'Failed send html.'));
    });
});

router.get('/refresh/ip/:ip/port/:port', function(req, res) {
    var ip = req.params.ip;
    var port = req.params.port;
    if (typeof ip !== 'string' || typeof port !== 'string') {
        res.statusCode = 400;
        res.send(generateResponse(null, 'Invalid or missing parameters.'));
		console.log('1');
        return;
    }
		console.log('12');
    var ws = findObjectInArray(wsList, function(socket) {
        return socket.ip.localeCompare(ip) == 0 && socket.port.localeCompare(port) == 0;
    });
		console.log('13');
    if (!ws || ws.socket.readyState !== 1) {
			console.log('4');
        res.statusCode = 500;
        res.send(generateResponse(null, 'No socket connection available.'));

        return;
    }
	console.log('4');
    ws.socket.send(generateCommand(req.constants.kCommandRefresh, null));
    res.statusCode = 200;
    res.setHeader('content-type', 'text/html');
    res.send(generateResponse(null, ''));
//	TODO: Implemented client acknowledgement.
//     ws.on('message', function(error) {
//         res.statusCode = error != null ? 500 : 200;
//         res.send(generateResponse(null, error == null ? error : 'Failed to send html.'));
//     });
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

function generateWSObject(ip, port) {
    var ws = new WebSocket('ws://' + ip + ':' + port);

    return {
        socket: ws,
        ip: ip,
        port: port
    };
}

function findObjectInArray(array, comparer) {
    for (var i = 0; i < array.length; i++) {
        if (comparer(array[i])) {
            return array[i];
        }
    }

    return null;
}


module.exports = router;