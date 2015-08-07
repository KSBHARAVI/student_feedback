var config = require('./config');
var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

mongoose.connect(config.MONGO_ADDRESS);

//not tied back to student, data is anonymous right now
//also define required fields
var feedbackSchema = mongoose.Schema({
  rating: {type: Number, max:5, min: 1},
  comment: {type: String, maxLength: 500}
});

//need to validate the size of the array and the type of data in it
//also need to determine required fields
var classSchema = mongoose.Schema({
  name: {type: String, maxLength: 100},
  description: {type: String, maxLength:500},
  students: {type: Array},
  monday: {type: Boolean},
  tuesday: {type: Boolean},
  wednesday: {type: Boolean},
  thursday: {type: Boolean},
  friday: {type: Boolean},
  saturday: {type: Boolean},
  sunday: {type: Boolean},
  //number of seconds from 00:00
  feedbackTime: {type: Number, max:86400}
});

var studentSchema = mongoose.Schema({
  name: {type: String, maxLength: 100},
  email: {type: String, maxLength: 100}
});

var Feedback = mongoose.model('Feedback', feedbackSchema);
var Class = mongoose.model('Class', classSchema);
var Student = mongoose.model('Student', studentSchema);

exports.Feedback = Feedback;
exports.Class = Class;
exports.Student = Student;
