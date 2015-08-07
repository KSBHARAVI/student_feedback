var should = require('should');
var Promise = require('bluebird');
var db = require('../db');

describe('database', function() {
  describe('feedback', function() {
    //this test was just to make sure I was using mongo right and that the coroutine pattern worked
    it('should inserted feedback into the database', function(done) {
      var testFeedback = new db.Feedback({rating: 3, comment: 'Yo!'});
      var test = Promise.coroutine(function* (testFeedback) {
        var insertResult = yield testFeedback.save();
        
        //insert test feedback
        insertResult.rating.should.equal(3);
        insertResult.comment.should.equal('Yo!');

        //remove test feedback
        yield db.Feedback.remove({_id: insertResult.id});
        done();
      });
      test(testFeedback);
    });
  });
});