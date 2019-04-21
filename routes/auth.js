const express       = require('express');
const md5           = require('md5');
const mysql         = require('mysql');
const router        = express.Router();

const config_db     = require('../config/database');
const connection    = mysql.createConnection(config_db);

/**
 * Auth Index Page
 */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});

/**
 * Login Page
 */
router.get('/login', function(req, res, next) {
	if (req.session.loggedin)
		res.redirect('/');
	res.render('auth/login', {message: req.flash('message')});
});

/**
 * Login Action
 */
router.post('/login', function(req, res, next) {
	const email     = req.body.email;
	const password  = req.body.password;
	if (email && password) {
		connection.query('SELECT * FROM `users` WHERE `email` = ?;', [email], function(error, rows, fields) {
			req.flash('email', email);
			req.flash('password', password);
			if (error) {
				console.log(error);
				req.flash('message', error.sqlMessage);
				res.redirect('/auth/login');
			} else {
				if (rows.length > 0) {
					if (rows[0].password === md5('7fa73b47df808d36c5fe328546ddef8b9011b2c6' + password)) {
						req.session.loggedin = true;
						req.session.user = rows[0].id;
						res.redirect('/');
					} else {
						req.flash('message', 'Incorrect Password!');
						res.redirect('/auth/login');
					}
				} else {
					req.flash('message', 'Unregistered Email!');
					res.redirect('/auth/login');
				}
			}
		});
	} else {
		req.flash('message', 'You should input all required fields');
		res.redirect('/auth/login');
	}
});

/**
 * Logout Action
 */
router.get('/logout', function(req, res){
	req.session.destroy();
	req.logout();
	res.redirect('/');
});

/**
 * Sign Up Page
 */
router.get('/signup', function(req, res, next) {
	if (req.session.loggedin)
		res.redirect('/');
	res.render('auth/signup', {message: req.flash('message')});
});

module.exports = router;
