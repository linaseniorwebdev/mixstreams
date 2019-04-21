const express   = require('express');
const router    = express.Router();

router.get('/', function(req, res, next) {
	res.render('home', {auth: !!(req.session.loggedin)});
});

module.exports = router;
