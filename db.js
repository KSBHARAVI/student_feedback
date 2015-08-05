var config = require('./config');
var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

mongoose.connect(config.MONGO_ADDRESS);

var feedbackSchema = mongoose.Schema({
  rating: {type: Number, max:5, min: 1},
  comment: {type: String, maxLength: 500}
});

var Feedback = mongoose.model('Feedback', feedbackSchema);

exports.Feedback = Feedback;