var WebSocket = require('ws');

//Public methods
module.exports = {
    initConnection: function(ip, port) {
        if (ip.legth == 0 || port.legth == 0) {
			 return false;
		}
	
	var ws = new WebSocket('ws://' + ip + ':' + port);		
		ws.on('open', function() {
		     ws.send('"command":"serverAddress", "payload" : {"ip":' + ip + ', "port":' + port + '}');
			  ws.close();
	});
    },
	
    discovered_clients: function() {
        return discovered_clients;
    }
};

