const express   = require('express');
const router    = express.Router();

router.get('/', function(req, res, next) {
	const auth = !!(req.session.loggedin);
	console.log('Cookies: ', req.cookies);
	if (auth) {
		console.log("Logged in");
		res.render('home', {auth: auth, name: req.session.name});
	} else {
		res.render('home', {auth: auth});
	}
});

module.exports = router;
