const cookieParser  = require('cookie-parser');
const createError   = require('http-errors');
const express       = require('express');
const flash         = require('connect-flash');
const logger        = require('morgan');
const path          = require('path');
const session       = require('express-session');

const authRouter    = require('./routes/auth');
const indexRouter   = require('./routes/index');
const userRouter   = require('./routes/user');

const app           = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret: 'this sentence should be changed later',
	resave: true,
	saveUninitialized: true
}));
app.use(flash());
app.use('/vendors', express.static(__dirname + '/node_modules/'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use(function(req, res, next) {
	next(createError(404));
});

app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
