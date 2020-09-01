var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars');
var fileupload = require("express-fileupload");
var session = require('express-session');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var MongoStore = require('connect-mongo')(session);
var app = express();
const db=require('./config/db')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname + '/views/layout/',partialsDir:__dirname + '/views/partials/'}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());

app.use(session(
    {
      secret: 'mysupersecret',
      store: new MongoStore({url: 'mongodb://localhost:27017/shopping', touchAfter: 24 * 3600}),
      cookie: {maxAge: 180 * 60 * 1000},
      saveUninitialized: true,
      resave: true,
    }));

app.use('/admin', adminRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
db.connect( (err) => {
    if (err) {
        console.log('Unable to connect Database');
        process.exit(1)
    } else {
        console.log('Database Started Successfully....');
    }
});
module.exports = app;
