var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

var defaultRouter = require('./routes/default');
var testRouter = require('./routes/test');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profile');
var view_profileRouter = require('./routes/view_profile');
var messagesRouter = require('./routes/messages');
var view_messagesRouter = require('./routes/view_messages');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var forgot_passwordRouter = require('./routes/forgot_password');
var reset_passwordRouter = require('./routes/reset_password');
var take_pictureRouter = require('./routes/take_picture');
var friendRequestRouter = require('./routes/friendRequest');
var sendMessageRouter = require('./routes/sendMessage');
var verifyRouter = require('./routes/verify');
var signoutRouter = require('./routes/logout');
var searchRouter = require('./routes/search');
var friendsRouter = require('./routes/friends');
var notificationsRouter = require('./routes/notifications');
var notifyRouter = require('./routes/notify');
var view_message_service = require('./routes/view_message_service');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(expressSession({ secret: 'max', saveUninitialized: false, resave: false }));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use('/', defaultRouter);
app.use('/test', testRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/profile', profileRouter);
app.use('/view_profile', view_profileRouter);
app.use('/messages', messagesRouter);
app.use('/view_messages', view_messagesRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/forgot_password', forgot_passwordRouter);
app.use('/reset_password', reset_passwordRouter);
app.use('/take_picture', take_pictureRouter);
app.use('/verify', verifyRouter);
app.use('/verify', verifyRouter);
app.use('/friendRequest', friendRequestRouter);
app.use('/sendMessage', sendMessageRouter);
app.use('/logout', signoutRouter);
app.use('/search', searchRouter);
app.use('/friends', friendsRouter);
app.use('/notifications', notificationsRouter);
app.use('/notify', notifyRouter);
app.use('/view_message_service', view_message_service);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
