var db = require('../db');
var Promise = require('bluebird');

var getClass = function(req, res) {
  var classId = req.params.id;

  var getClassRoutine = Promise.coroutine(function* (classId) {
    var retrievedClass = yield db.Class.find({_id: classId});
    if (retrievedClass.length === 0) {
      res.status(400).send({success: false});
    }
    else {
      //there seems to be a lot of methods being submitted with the array
      //look into managing arrays in mongo better
      res.status(200).send({success: true, data: retrievedClass[0]});
    }
  });

  getClassRoutine(classId).catch(function(err) {
    console.log(err);
  });
}

module.exports = getClass;