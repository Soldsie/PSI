var mongoose = require('mongoose');
require('../model/media.js');
require('../model/comment.js');
var Media = mongoose.model('Media');
var Comment = mongoose.model('Comment');

var instagram = require('./instagram.js');
var _ = require('underscore')._;




var o = {};
o.map = function () { 
  emit(this.tag, {comment: parseInt(this.comments.count), like: parseInt(this.likes.count)} );
}

o.reduce = function (k, vals) {
  var commentScore = 0;
  var likeScore = 0;
  for(var i=0; i<vals.length; i++) {
    var val = vals[i];
    commentScore += val.comment;
    likeScore += val.like;
  }
  return {comment: commentScore, like: likeScore };
}

var score = function(callback) { 
  Media.mapReduce(o, callback)
}

module.exports = {
  score: score
};