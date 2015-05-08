var express = require('express');
var router = express.Router();

/*
	GET discovered clients.
*/
router.get('/discovered', function(req, res) {
	if (req.discovered_clients) {
		res.statusCode = 200;
        res.setHeader( 'content-type', 'text/html' );
		res.json(req.discovered_clients);	
	} else {
		res.statusCode = 404;
	}   	
});

module.exports = router;
