const express       = require('express');
const md5           = require('md5');
const mysql         = require('mysql');
const router        = express.Router();

const config_db     = require('../config/database');
const connection    = mysql.createConnection(config_db);

const config_auth   = require('../config/auth');

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
	const remember = req.cookies.remember;
	if (remember === undefined) {
		const message = req.flash('message');
		const email = req.flash('emails');
		const password = req.flash('password');
		console.log(message);
		console.log(email);
		console.log(password);
		if (message.length < 1) {
			res.render('auth/login');
		} else {
			res.render(
				'auth/login',
				{
					message: message[0],
					email: email[0],
					password: password[0]
				}
			);
		}
	} else {
		res.render(
			'auth/login',
			{
				message: req.flash('message'),
				email: req.cookies.email,
				password: req.cookies.password,
				remember: remember
			}
		);
	}
});

/**
 * Login Action
 */
router.post('/login', function(req, res, next) {
	const email     = req.body.email;
	const password  = req.body.password;
	const remember  = req.body.remember;
	if (email && password) {
		connection.query('SELECT * FROM `users` WHERE `email` = ?;', [email], function(error, rows, fields) {
			req.flash('emails', email);
			req.flash('password', password);
			if (error) {
				console.log(error);
				req.flash('message', error.sqlMessage);
				res.redirect('/auth/login');
			} else {
				if (rows.length > 0) {
					if (rows[0].password === md5(config_auth.salt + password)) {
						req.session.loggedin = true;
						req.session.user = rows[0].id;
						req.session.name = rows[0].first + " " + rows[0].last;
						if (remember === "on") {
							res.cookie('remember' , 'on', {maxAge: 7200000});
							res.cookie('email' , email, {maxAge: 7200000});
							res.cookie('password' , password, {maxAge: 7200000});
						}
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

/**
 * Sign Up Action
 */
router.post('/signup', function(req, res, next) {
	const first     = req.body.first;
	const last      = req.body.last;
	const email     = req.body.email;
	const password  = req.body.password;

	req.flash('first', first);
	req.flash('last', last);
	req.flash('email', email);
	req.flash('password', password);

	connection.query('SELECT * FROM `users` WHERE `email` = ?;', [email], function(error, rows, fields) {
		if (error) {
			console.log(error);
			req.flash('message', error.sqlMessage);
			res.redirect('/auth/signup');
		} else {
			if (rows.length > 0) {
				req.flash('message', 'Email already registered!');
				res.redirect('/auth/signup');
			} else {
				connection.query('INSERT INTO `users`(`email`, `password`, `first`, `last`) VALUES (?);', [[email, md5(config_auth.salt + password), first, last]], function(error, rows) {
					if (error) {
						console.log(error);
						req.flash('message', error.sqlMessage);
						res.redirect('/auth/signup');
					} else
						res.redirect('/auth/login');
				});
			}
		}
	});
});

module.exports = router;
