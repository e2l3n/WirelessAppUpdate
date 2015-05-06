var express = require('express');
var router = express.Router();

/*
 * GET discovered services.
*/
router.get('/discovered', function(req, res) {
   res.json(req.discovered_services);
});

module.exports = router;
