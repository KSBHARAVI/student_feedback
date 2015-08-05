var config = require('./config');
var should = require('should');
var Promise = require('bluebird');
var db = require('../db');
var request = require('superagent-bluebird-promise');

describe('database', function() {
  describe('forms', function() {
    it('should create an empty form and accept a user submission', function(done) {
      var testFeedback = new db.Feedback();
      var test = Promise.coroutine(function* (testFeedback) {

        //create empty feedback
        var insertResult = yield testFeedback.save();

        //user submission
        var submissionResult = yield request.post(config.SERVER_ADDRESS + '/feedback')
          .query({id: insertResult.id})
          .type('form')
          .send({rating: 5})
          .send({comment: 'Hello!'})
          .promise();
        submissionResult.text.should.equal('Form submitted!');

        //make sure inserted feedback is correct
        var processedFeedback = yield db.Feedback.findOne({_id: insertResult.id});
        processedFeedback.rating.should.equal(5);
        processedFeedback.comment.should.equal('Hello!');

        //remove test feedback
        yield db.Feedback.remove({_id: insertResult.id});
        done();
      });
      test(testFeedback);
    });
  });
});