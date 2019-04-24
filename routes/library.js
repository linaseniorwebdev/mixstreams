const express   = require('express');
const router    = express.Router();

/**
 * Index Page
 */
router.get('/', function(req, res, next) {
	if (req.session.loggedin)
		res.render('library/index', {name: req.session.name});
	else
		res.redirect('/auth/login');
});

router.get('/mine', function(req, res, next) {
	if (req.session.loggedin)
		res.render('library/mine', {name: req.session.name});
	else
		res.redirect('/auth/login');
});

router.get('/purchased', function(req, res, next) {
	if (req.session.loggedin)
		res.render('library/purchased', {name: req.session.name});
	else
		res.redirect('/auth/login');
});

router.get('/upload', function(req, res, next) {
	if (req.session.loggedin)
		res.render('library/upload', {name: req.session.name});
	else
		res.redirect('/auth/login');
});

module.exports = router;
