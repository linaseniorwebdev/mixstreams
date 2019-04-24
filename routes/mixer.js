const express   = require('express');
const router    = express.Router();

/**
 * Profile Page
 */
router.get('/', function(req, res, next) {
	if (req.session.loggedin)
		res.render('user/profile');
	else
		res.redirect('/auth/login');
});

module.exports = router;
