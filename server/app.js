var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var arrayUtils = require('./utilities/array');

var routes = require('./routes/index');
var clients = require('./routes/clients');

var app = express();

var discovered_clients = [];

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

// Make discovered services accessible to the router
app.use(function(req,res,next) {
   req.discovered_clients = discovered_clients;
   next();
});

app.use('/', routes);
app.use('/clients', clients);

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

//connect socket.io to the server
/*
server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
	console.log('socket.io started');
});

*/

// Import mdns  module
var mdns = require('mdns');

// advertise a http server on port 4321
var ad = mdns.createAdvertisement(mdns.tcp('http'), 4321);
ad.start();

// watch all http servers
var browser = mdns.createBrowser(mdns.tcp('http'));
browser.on('serviceUp', function(service) {
  console.log("service up: ", service);
  discovered_clients.pushIfNotExist(service, function(existingElem) { 
    return existingElem.name === service.name; 
});
});

browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
  discovered_clients = discovered_clients.filter(function (aService) {
		return aService.fullname !== service.fullname;	
		});
});

	

browser.start();

module.exports = app;


