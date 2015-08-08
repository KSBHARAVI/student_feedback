var express = require('express');
var uuid = require('uuid');
var parser = require('body-parser');


var port = process.env.PORT || 3000;
var app = express();

app.use(parser.urlencoded());
app.use(parser.json());

app.get('/', function(req, res) {
  res.send(uuid.v4());
});

//retrieve feedback
var retrieveFeedback = require('./route_handlers/retrieveFeedback');
app.get('/feedback/:id', retrieveFeedback);

//submit feedback
var processFeedback = require('./route_handlers/processFeedback');
app.post('/feedback/', processFeedback);

//create a class
var createClass = require('./route_handlers/createClass');
app.post('/class', createClass);

//retrieve a class
var getClass = require('./route_handlers/getClass');
app.get('/class/:id', getClass);

var server = app.listen(port, function(server) {
  console.log('Node server started, listening on: ', port);
});