const express   = require('express');
const router    = express.Router();

router.get('/', function(req, res, next) {
	const auth = !!(req.session.loggedin);
	if (auth) {
		res.render('home', {auth: auth, name: req.session.name});
	} else {
		res.render('home', {auth: auth});
	}
});

module.exports = router;
