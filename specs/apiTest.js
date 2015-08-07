var config = require('./config');
var should = require('should');
var Promise = require('bluebird');
var db = require('../db');
var request = require('superagent-bluebird-promise');

describe('api', function() {
  describe('/feedback', function() {
    it('should POST a user submission', function(done) {
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
        submissionResult.text.should.equal('Feedback submitted!');

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

    it('should GET feedback data', function(done) {
      var testFeedback = new db.Feedback({
        rating: 5,
        comment: 'Hello!'
      });
      var test = Promise.coroutine(function* (feedbackId) {
        var insertResult = yield testFeedback.save();
        var address = config.SERVER_ADDRESS + '/feedback/' + insertResult.id;
        var feedbackResponse = yield request.get(address).promise();
        feedbackResponse.body.data.rating.should.equal(5);
        feedbackResponse.body.data.comment.should.equal('Hello!');
        done();
      });
      test();
    });
  });

  describe('/class', function() {
    it('should POST a class', function() {
      var testClass = {
        name: 'Test class name',
        description: 'This is a dope close',
        students: [{name: 'Richie', email: 'richie@gmail.com'}],
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: false,
        feedbackTime: 50000
      };

      var test = Promise.coroutine(function* (testClass) {
        //user submission
        var submissionResult = yield request.post(config.SERVER_ADDRESS + '/class')
          .type('form')
          .send(testClass)
          .promise();

        //make sure inserted Class is correct
        var processedClass = yield db.Class.findOne({_id: submissionResult.body.classId});
        processedClass.name.should.equal(testClass.name);
        processedClass.description.should.equal(testClass.description);
        processedClass.monday.should.equal(testClass.monday);
        processedClass.tuesday.should.equal(testClass.tuesday);
        processedClass.wednesday.should.equal(testClass.wednesday);
        processedClass.thursday.should.equal(testClass.thursday);
        processedClass.friday.should.equal(testClass.friday);
        processedClass.saturday.should.equal(testClass.saturday);
        processedClass.sunday.should.equal(testClass.sunday);
        processedClass.feedbackTime.should.equal(testClass.feedbackTime);
        processedClass.students.should.eql(testClass.students);

        //remove test Class
        yield db.Class.remove({_id: submissionResult.id});
        done();
      });
      test(testClass);
    });      
  });
});
