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

app.get('/feedback/:id', function(req, res) {
  res.send('This will be a form page');
});

var processFeedback = require('./route_handlers/processFeedback');
app.post('/feedback/', processFeedback);

var server = app.listen(port, function(server) {
  console.log('Node server started, listening on: ', port);
});