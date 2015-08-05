var express = require('express');
var uuid = require('uuid');


var port = process.env.PORT || 3000;
var app = express();

app.get('/', function(req, res) {
  res.send(uuid.v4());
});

var server = app.listen(port, function(server) {
  console.log('Node server started, listening on: ', port);
});