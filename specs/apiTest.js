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

        //delete test data when done
        yield testFeedback.remove();
        done();
      });
      test();
    });
  });

  describe('/class', function() {
    it('should POST a class', function(done) {
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
        processedClass.students[0].should.eql(testClass.students[0]);

        //remove test Class
        yield db.Class.remove({_id: submissionResult.body.classId});
        done();
      });
      test(testClass);
    });

    it('should GET a class', function(done) {
      var testClass = new db.Class({
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
      });

      var test = Promise.coroutine(function* () {
        var insertResult = yield testClass.save();
        var address = config.SERVER_ADDRESS + '/class/' + insertResult._id;
        var classResponse = yield request.get(address).promise();
        classResponse.body.data.name.should.equal(testClass.name);
        classResponse.body.data.description.should.equal(testClass.description);
        classResponse.body.data.monday.should.equal(testClass.monday);
        classResponse.body.data.tuesday.should.equal(testClass.tuesday);
        classResponse.body.data.wednesday.should.equal(testClass.wednesday);
        classResponse.body.data.thursday.should.equal(testClass.thursday);
        classResponse.body.data.friday.should.equal(testClass.friday);
        classResponse.body.data.saturday.should.equal(testClass.saturday);
        classResponse.body.data.sunday.should.equal(testClass.sunday);
        classResponse.body.data.feedbackTime.should.equal(testClass.feedbackTime);
        classResponse.body.data.students[0].should.eql(testClass.students[0]);
        
        //remove test Class
        yield db.Class.remove({_id: insertResult._id});
        done();
      });
      test();
    });      
  });
});
