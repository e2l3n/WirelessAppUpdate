var express = require('express');
var router = express.Router();

/*
	GET discovered clients.
*/
router.get('/discovered', function(req, res) {
	//if (req.discovered_clients) {
		//res.writeHead(200, {'Content-Type': 'application/json'});
		res.json(req.discovered_clients);	
	//} else {
	//	res.writeHead(404);
	//}   	
});

module.exports = router;
