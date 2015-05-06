var express = require('express');
var router = express.Router();

/*
 * GET discovered clients.
*/
router.get('/discovered', function(req, res) {
   res.json(req.discovered_clients);
});

module.exports = router;
