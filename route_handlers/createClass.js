var db = require('../db');
var Promise = require('bluebird');

//needs more error handling / robustness
var createClass = function(req, res) {
  var classData = req.body;

  var createClass = Promise.coroutine(function* (classData) {
    var newClass = new db.Class(classData);
    var createdClass = yield newClass.save();
    console.log(createdClass);
    //change this a json response when there is a singlepage front-end
    res.status(200).send({success: true, classId: createdClass.id});
  });

  createClass(classData);
}

module.exports = createClass;