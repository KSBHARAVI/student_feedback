var db = require('../db');
var Promise = require('bluebird');

var retrieveFeedback = function(req, res) {
  var formId = req.params.id;

  var retrieveFeedbackRoutine = Promise.coroutine(function* (formId) {
    var retrievedFeedback = yield db.Feedback.find({_id: formId});
    if (retrievedFeedback.length === 0) {
      res.status(400).send({success: false});
    }
    else {
      res.status(200).send({success: true, data: retrievedFeedback[0]});
    }
  });

  retrieveFeedbackRoutine(formId);
}

module.exports = retrieveFeedback;