var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
/*
/Aqui va la conexión a la base de datos mierda puto Mitchel como te odio a la verga
/
*/
var pool = mysql.createPool({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'n0m3l0',
  database : 'amoxtli',
  connectionLimit : 10
});
//TERMINA LA CONEXIÓN//

var routes = require('./routes/index');
var users = require('./routes/users')(pool);
var sessions = require('./routes/sessions')(pool);

var app = express();
//SET SESSION
app.use(session({
    secret: 'mitchelhdz',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/sessions', sessions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
