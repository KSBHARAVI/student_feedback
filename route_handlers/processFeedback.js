var db = require('../db');
var Promise = require('bluebird');

var processFeedback = function(req, res) {
  var formId = req.query.id;
  var formData = req.body;

  var submitFeedback = Promise.coroutine(function* (formId, formData) {
    var foundFeedback = yield db.Feedback.find({_id: formId});
    //only update form if its empty (__v = 0)
    var submittedFeedback = yield db.Feedback.update({__v: 0, _id: formId}, formData);
    res.send('Form submitted!');
  });

  submitFeedback(formId, formData);
}

module.exports = processFeedback;